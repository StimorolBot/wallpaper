from email.message import EmailMessage


def email_confirm(
        email: EmailMessage, user_email: str,
        code: str, user_agent: str, origin: str,
        client_host: str
):
    email["Subject"] = "Подтверждение почты"

    email.set_content(f"""
        <div style=
            "color: #e3e7e9;
            margin-top:20px;
            font-size:20px;
            border-radius:20px;
            background-color: hsl(223, 10%, 25%);
            padding: 15px 10px;
        ">
            <h2 style="text-align: center;">
                Здравствуйте!
            </h2>
            
            <div style="
                color: #fff;
                margin: 15px 0;
            ">
                Код, необходимый для регистрации {user_email}: 
            </div>
            
            <div style="
                color: #1e96ff;
                font-weight: 800;
                font-size: 60px;
                text-align: center;
                background-color: #2a2a2d;
                padding: 15px;
                border-radius: 20px;
                margin: 25px 0;
            ">
                {code}
            </div>
            
            <div>
                Вы получили это письмо из-за попытки регистрации учетной
                записи на сайте {origin} из браузера {user_agent} по 
                адресу {client_host}
            </div>
            
            <div style="margin: 15px 0;">
                Если вы не пытались создать учетную запись, проигнорируйте это письмо
            </div>
        </div>
    """, subtype="html")
    return email


def reset_password(
        email: EmailMessage, user_email: str,
        code: str, user_agent: str, origin: str,
        client_host: str
):
    email["Subject"] = "Сброс пароля"

    email.set_content(f"""
        <div style=
            "color: #e3e7e9;
            margin-top:20px;
            font-size:20px;
            border-radius:20px;
            background-color: hsl(223, 10%, 25%);
            padding: 15px 10px;
        ">
            <h2 style="text-align: center;">
                Здравствуйте!
            </h2>

            <div style="
                color: #fff;
                margin: 15px 0;
            ">
                Код, необходимый для сброса пароля от учетной записи {user_email}: 
            </div>

            <div style="
                color: #1e96ff;
                font-weight: 800;
                font-size: 60px;
                text-align: center;
                background-color: #2a2a2d;
                padding: 15px;
                border-radius: 20px;
                margin: 25px 0;
            ">
                {code}
            </div>

            <div>
                Вы получили это письмо из-за попытки сброса пароля учетной
                записи на сайте {origin} из браузера {user_agent} по 
                адресу {client_host}
            </div>

            <div style="margin: 15px 0;">
                Если вы не пытались сбросить пароль, проигнорируйте это письмо
            </div>
        </div>
    """, subtype="html")
    return email
