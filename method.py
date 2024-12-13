import random


class door:
    def __init__(self, name):
        self.isGoat = True
        self.probability = 0.33
        self.isOpen = False


class monty:
    def __init__(self):
        self.doors = [door("A"), door("B"), door("C")]
        self.init_doors()

    def init_doors(self):
        # Inicializar todas las puertas con cabra y cerradas
        for door in self.doors:
            door.isGoat = True
            door.isOpen = False

        # Elegir aleatoriamente una puerta para el auto y quitarle la cabra
        car_door = random.randint(0, len(self.doors) - 1)
        self.doors[car_door].isGoat = False
            

    def print_doors(self):
        for door in self.doors:
            if door.isGoat:
                if door.isOpen:
                    print("Cabra ", door.isOpen)
                else:
                    print("Cabra ", door.isOpen, ", probability ", door.probability)
            else:
                if door.isOpen:
                    print("Carro ", door.isOpen)
                else:
                    print("Carro ", door.isOpen, ", probability ", door.probability)

    def game(self):
        self.init_doors()
        choice = int(input("Elige una puerta "))
        print("Has elegido la puerta", choice)
        print("=================")
        print("Se abrira una puerta para ayudarte")
        found_goat_door = False
        for i in range(len(self.doors)):
            if self.doors[choice].isGoat:
                if self.doors[i].isGoat and i != choice:
                    if not found_goat_door:
                        goat_doors = [j for j in range(len(self.doors)) if self.doors[j].isGoat and j != choice]
                        random_goat_door = random.choice(goat_doors)
                        self.doors[random_goat_door].isOpen = True
                        print("Se abrió la puerta con cabra: ", random_goat_door)
                        found_goat_door = True
                for j in range(len(self.doors)):
                    if not self.doors[j].isGoat:
                        auxDoor = j
                        self.doors[auxDoor].probability = 0.66
            else:
                if self.doors[i].isGoat and i != choice:
                    if not found_goat_door:
                        # Randomly select one of the two goat doors
                        goat_doors = [j for j in range(len(self.doors)) if self.doors[j].isGoat and j != choice]
                        random_goat_door = random.choice(goat_doors)
                        self.doors[random_goat_door].isOpen = True
                        print("Se abrió la puerta con cabra: ", random_goat_door)
                        

                        found_goat_door = True
                    for j in range(len(self.doors)):
                        if self.doors[j].isGoat and not self.doors[j].isOpen:
                            auxDoor = j
                            self.doors[auxDoor].probability = 0.66
        self.print_doors()
        print("=================")
            
        print("Mantienes la puerta ", choice, "?")
        print("O la cambias por la puerta ",auxDoor,"?")
                
        election = (input("s para cambiar, n para mantener "))
        print("=================")
        if election == "s":
            finalChoice = auxDoor
            print("Ahora tu puerta es la ", finalChoice)
        else:
            finalChoice = choice
            print("Tu puerta seguira siendo la ", finalChoice)
        if self.doors[finalChoice].isGoat:
            print("Has perdido, tu eleccion es una cabra")
        else:
            print("Ganaste, tu eleccion es un automovil")
            
        

def main():
    game = monty()
    #print("Desde aca")
    while True:
        game.game()
        a = input("Desea jugar otra vez?. s para si, n para no ")
        if a != "s":
            break


if __name__ == "__main__":
    main()
