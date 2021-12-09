all: pre
	gcc game.c banqi.o -lm -o game
	rm -f *.o

pre:
	gcc banqi.c -c -o banqi.o

clean:
	rm -f *.o game