console.log(
  "RUN: aws sts assume-role --role-arn arn:aws:iam::328502120762:role/temp-wundermann --role-session-name AWSCLI-Session --profile ioc-production --serial-number arn:aws:iam::328502120762:mfa/mahan.sagharchi@wunderman.com --duration-seconds 900 --token-code <MFA>"
);
