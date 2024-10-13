import ssl
import smtplib
from typing import TYPE_CHECKING
from email.message import EmailMessage
from bg_task.type_email import TypeEmail

if TYPE_CHECKING:
    from src.app.auth.schemas import ValidEmail

from bg_task.config import smtp_setting, celery
from bg_task.template import email_confirm, reset_password


@celery.task(name="code-confirm", max_retries=3, default_retry_delay=3, limit=3)
def send_email(
        user_email: "ValidEmail", email_type: TypeEmail,
        code: str, user_agent: str,
        origin: str, client_host: str
):
    email = EmailMessage()
    email["From"] = smtp_setting.ADMIN_EMAIL
    email["To"] = smtp_setting.ADMIN_EMAIL
    context = ssl.create_default_context()

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

    with smtplib.SMTP_SSL(smtp_setting.host, smtp_setting.port, context=context) as server:
        server.login(smtp_setting.ADMIN_EMAIL, smtp_setting.PASSWORD)
        server.send_message(template)
