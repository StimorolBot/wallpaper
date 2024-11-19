FROM python:3.12.7

WORKDIR /back

RUN cd /back && mkdir .log

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

