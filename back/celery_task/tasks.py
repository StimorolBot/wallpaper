from email.message import EmailMessage

from .config import celery
from .smtp.type_email import TypeEmail
from .smtp.smtp_functools import create_server, get_template


@celery.task(name="smtp_task", max_retries=3, default_retry_delay=3, limit=3)
def send_email(user_email: str, email_type: TypeEmail, code: str, user_agent: str, origin: str, client_host: str):
    email = EmailMessage()
    template = get_template(email, email_type, code, user_agent, origin, client_host)
    create_server(template)
