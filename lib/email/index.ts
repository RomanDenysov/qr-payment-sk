import { env } from '@/env';
import * as SibApiV3Sdk from '@getbrevo/brevo';
import { render } from '@react-email/components';
import { OTPEmail } from './templates/otp-email';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  env.BREVO_API_KEY
);

export const sendOTPEmail = async (
  email: string,
  otpCode: string,
  username?: string
) => {
  const emailHtml = await render(
    OTPEmail({
      username,
      otpCode,
      expiresIn: 10,
    })
  );

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = `Код подтверждения: ${otpCode}`;
  sendSmtpEmail.htmlContent = emailHtml;
  sendSmtpEmail.sender = {
    name: 'QR Platby',
    email: 'noreply@qr-platby.online',
  };
  sendSmtpEmail.to = [{ email: email }];

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: result.body.messageId };
  } catch (error) {
    console.error('OTP Email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
