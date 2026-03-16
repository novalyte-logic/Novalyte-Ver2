import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import express from "express";
import helmet from 'helmet';
import crypto from 'node:crypto';
import path from "path";
import { createServer as createViteServer } from "vite";
import { aiService } from "./server/lib/aiService";
import aiRouter from "./server/routes/ai";
import adminRouter from "./server/routes/admin";
import authRouter from './server/routes/auth';
import clinicRouter from './server/routes/clinic';
import { getAllowedOrigins, serverEnv } from './server/lib/env';
import publicRouter from './server/routes/public';
import telemetryRouter from './server/routes/telemetry';
import workforceRouter from "./server/routes/workforce";

async function startServer() {
  const app = express();
  const allowedOrigins = new Set(getAllowedOrigins());

  app.set('trust proxy', serverEnv.trustProxy);

  app.use((req, res, next) => {
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();

    res.locals.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      if (!serverEnv.requestLoggingEnabled) {
        return;
      }

      console.info(
        JSON.stringify({
          level: 'info',
          message: 'request_completed',
          requestId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt,
          ip: req.headers['x-forwarded-for'] || req.ip || '',
        }),
      );
    });

    next();
  });

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      credentials: true,
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // API routes
  app.use('/api/auth', authRouter);
  app.use("/api/public", publicRouter);
  app.use("/api/telemetry", telemetryRouter);
  app.use("/api/ai", aiRouter);
  app.use('/api/clinic', clinicRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/workforce", workforceRouter);
  
  app.get("/api/health", (_req, res) => {
    const aiHealth = aiService.getHealthStatus();
    res.json({
      status: 'ok',
      environment: serverEnv.nodeEnv,
      releaseVersion: serverEnv.releaseVersion || 'development',
      time: new Date().toISOString(),
      services: {
        supabaseConfigured: Boolean(serverEnv.supabaseUrl && serverEnv.supabaseSecretKey),
        aiConfigured: aiHealth.configured,
        aiFastModel: aiHealth.fastModel,
        aiTimeoutMs: aiHealth.timeoutMs,
        analyticsIngest: serverEnv.analyticsEndpointEnabled,
        clientErrorIngest: serverEnv.clientErrorEndpointEnabled,
      },
    });
  });

  // Vite middleware for development
  if (serverEnv.isDevelopment) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }

    console.error(
      JSON.stringify({
        level: 'error',
        message: 'unhandled_server_error',
        requestId: res.locals.requestId || '',
        path: req.originalUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    );

    return res.status(500).json({
      error: 'Internal server error.',
      requestId: res.locals.requestId || null,
    });
  });

  app.listen(serverEnv.port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${serverEnv.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
