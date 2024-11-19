import ssl
import smtplib
from email.message import EmailMessage

from .type_email import TypeEmail
from .config import gmail_setting
from .template import email_confirm, reset_password


def get_template(
        email: EmailMessage, email_type: TypeEmail,
        code: str, user_agent: str, origin: str, client_host: str,
        user_email: str = gmail_setting.ADMIN_EMAIL
):
    email["From"] = gmail_setting.ADMIN_EMAIL
    email["To"] = user_email

    if email_type in TypeEmail.CONFIRM.value:
        template = email_confirm(
            email=email, user_email=user_email,
            code=code, user_agent=user_agent,
            origin=origin, client_host=client_host
        )
    elif email_type in TypeEmail.RESET.value:
        template = reset_password(
            email=email, user_email=user_email,
            code=code, user_agent=user_agent,
            origin=origin, client_host=client_host
        )
    return template


def create_server(template):
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(gmail_setting.HOST, gmail_setting.PORT, context=context) as server:
        server.login(gmail_setting.ADMIN_EMAIL, gmail_setting.PASSWORD)
        server.send_message(template)
