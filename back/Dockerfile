FROM python:latest

WORKDIR /back

COPY ./requirements.txt /back/requirements.txt

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /back

EXPOSE 5000

CMD ["python", "main.py"]