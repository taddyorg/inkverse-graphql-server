import express, { Router, type NextFunction, type Request, type Response } from 'express';
import { getSafeError } from '../shared/utils/errors.js';
import { QUEUE_NAMES, sendMessage, INKVERSE_HIGH_PRIORITY_TYPE } from '../shared/queues/utils.js';

const router = Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.post('/process-taddy-webhook', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('This endpoint is not used in production. We use a Lambda function to process webhooks from Taddy in production.');
    }
    
    let safeErrorMessage = "Could not process Taddy webhook";
    const headers = req.headers;
    
    try {
      const providedWebhookSecret = headers['X-TADDY-WEBHOOK-SECRET'] || headers['x-taddy-webhook-secret'];
      if (providedWebhookSecret !== process.env.TADDY_WEBHOOK_SECRET) {
        res.status(401).json({ error: 'Invalid webhook secret' });
        return;
      }

      const body = {
        ...req.body,
        type: INKVERSE_HIGH_PRIORITY_TYPE.PROCESS_TADDY_WEBHOOK
      };

      //send to sqs
      await sendMessage(QUEUE_NAMES.INKVERSE_HIGH_PRIORITY, body);

      res.status(200).send('OK')
    } catch(error) {
      next(getSafeError(error, safeErrorMessage));
    }
});

export default router;