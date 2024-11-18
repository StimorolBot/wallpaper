buildFront:
	docker build ./front --tag "wallpaper-front"
buildBack:
	docker build ./back --tag "wallpaper-back"
runFront:
	docker run -p 5173:5173 "wallpaper-front"
runBack:
	docker run -p 8000:80 "wallpaper-back"
buildContainer:
	docker compose up
rmAllContainer:
	docker system prune -a

runUvicorn:
	cd back && uvicorn src.main:app --reload
runCelery:
	cd back && celery -A bg_task.config:celery worker --loglevel=INFO --pool=solo
runFlower:
	cd back && celery -A bg_task.config:celery flower --loglevel=INFO
