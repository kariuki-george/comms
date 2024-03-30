build:
	@go build -o bin/ cmd/main.go 

run: build
	@./bin/main

# https://github.com/silenceper/gowatch
watch: 
	@gowatch -o ./bin/main -p ./cmd/main.go  