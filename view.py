import pygame
import sys
from method import monty  # Importamos la clase monty

# Dimensiones de la ventana
WIDTH, HEIGHT = 800, 600

# Colores
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Inicializar Pygame
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Juego Monty Hall")
font = pygame.font.Font(None, 36)

# Posiciones de las puertas
DOOR_POSITIONS = [(30, 100), (220, 100), (420, 100)]

class MontyHallGame:
    def __init__(self):
        # Inicializar imagenes (usa placeholders si no tienes imagenes)
        try:
            self.door_image = pygame.image.load("img/door.png")
            self.goat_image = pygame.image.load("img/goat.png")
            self.car_image = pygame.image.load("img/car.png")
        except:
            # Crear imagenes simples si no se encuentran
            self.door_image = pygame.Surface((150, 300))
            self.door_image.fill((139, 69, 19))  # Color marrón
            
            self.goat_image = pygame.Surface((150, 300))
            self.goat_image.fill((150, 150, 150))  # Color gris
            
            self.car_image = pygame.Surface((150, 300))
            self.car_image.fill((0, 255, 0))  # Color verde

        # Instancia del juego de Monty Hall
        self.game = monty()
        
        # Estado del juego
        self.phase = "selection"
        self.initial_choice = None
        self.final_choice = None

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            
            if event.type == pygame.MOUSEBUTTONDOWN:
                pos = event.pos
                
                # Fase de selección inicial
                if self.phase == "selection":
                    for i, (x, y) in enumerate(DOOR_POSITIONS):
                        door_rect = pygame.Rect(x, y, self.door_image.get_width(), self.door_image.get_height())
                        if door_rect.collidepoint(pos):
                            self.initial_choice = i
                            self.game.doors[self.initial_choice].probability = 0.33
                            self.game.game()  # Ejecuta la lógica del juego
                            self.phase = "decision"
                            break
                
                # Fase de decisión
                elif self.phase == "decision":
                    # Botón de cambiar
                    if 250 <= pos[0] <= 350 and 500 <= pos[1] <= 550:
                        # Encuentra la puerta que no está abierta y no es la inicial
                        self.final_choice = [j for j in range(3) if j != self.initial_choice and not self.game.doors[j].isOpen][0]
                        self.phase = "result"
                    
                    # Botón de mantener
                    elif 450 <= pos[0] <= 550 and 500 <= pos[1] <= 550:
                        self.final_choice = self.initial_choice
                        self.phase = "result"
                
                # Reiniciar juego
                elif self.phase == "result":
                    self.phase = "selection"
                    self.game = monty()
                    self.initial_choice = None
                    self.final_choice = None

    def draw(self):
        screen.fill(WHITE)
        
        # Dibujar puertas
        for i, door in enumerate(self.game.doors):
            x, y = DOOR_POSITIONS[i]
            
            # Seleccionar imagen
            if door.isOpen:
                image = self.goat_image if door.isGoat else self.car_image
            else:
                image = self.door_image
            
            # Dibujar imagen
            screen.blit(image, (x, y))
            
            # Marcar puerta seleccionada
            if self.initial_choice == i and self.phase != "result":
                pygame.draw.rect(screen, RED, (x - 5, y - 5, image.get_width() + 10, image.get_height() + 10), 3)

        # Dibujar botones de decisión
        if self.phase == "decision":
            pygame.draw.rect(screen, GREEN, (250, 500, 100, 50))
            pygame.draw.rect(screen, RED, (450, 500, 100, 50))
            
            change_text = font.render("Cambiar", True, BLACK)
            stay_text = font.render("Mantener", True, BLACK)
            screen.blit(change_text, (260, 510))
            screen.blit(stay_text, (460, 510))

        # Mostrar resultado
        if self.phase == "result":
            result_text = "¡Ganaste!" if not self.game.doors[self.final_choice].isGoat else "¡Perdiste!"
            text = font.render(result_text, True, BLUE)
            text_rect = text.get_rect(center=(WIDTH//2, 50))
            screen.blit(text, text_rect)

            # Botón de reiniciar
            pygame.draw.rect(screen, GREEN, (350, 500, 100, 50))
            restart_text = font.render("Reiniciar", True, BLACK)
            screen.blit(restart_text, (360, 510))

        pygame.display.flip()

    def run(self):
        clock = pygame.time.Clock()
        while True:
            self.handle_events()
            self.draw()
            clock.tick(60)

def main():
    game = MontyHallGame()
    game.run()

if __name__ == "__main__":
    main()