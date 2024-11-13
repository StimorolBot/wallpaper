buildFront:
	docker build ./front --tag "wallpaper-front"
buildBack:
	docker build ./back --tag "wallpaper-back"
runFront:
	docker run -p 5173:5173 "wallpaper-front"
runBack:
	docker run -p 8000:8000 "wallpaper-back"
buildContainer:
	docker compose up
rmAllContainer:
	docker sustem prune -a
