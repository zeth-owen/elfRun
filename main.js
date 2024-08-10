const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
const context = canvas.getContext('2d');
const resultElement = document.getElementById('result')
const body = document.body;

canvas.width = body.clientWidth * 0.5;
canvas.height = body.clientHeight * 0.6;

const isMobile = window.innerWidth <= 768; 

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };

        this.rotation = 0;
        this.opacity = 1;

        const image = new Image();
        image.src = './assets/fighter.png';
        image.onload = () => {
            console.log("Image loaded:", image.width, "x", image.height);
            this.image = image;
            const scale = 1.5;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };
    }

    draw() {
        context.save();
        context.globalAlpha = this.opacity
        context.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );

        context.rotate(this.rotation);

        context.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        );

        context.drawImage(
            this.image,
            this.position.x,
            this.position.y
        );

        context.restore();
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}

class Projectiles {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.radius = 4
    }
    draw() {
        context.beginPath()
        context.arc(this.position.x,this.position.y, this.radius, 0,
            Math.PI * 2)
            context.fillStyle = 'red'
            context.fill()
            context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw() {
        context.save()
        context.globalAlpha = this.opacity
        context.beginPath()
        context.arc(this.position.x,this.position.y, this.radius, 0,
        Math.PI * 2)
        context.fillStyle = this.color
        context.fill()
        context.closePath()
        context.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.fades)
        this.opacity -= 0.01
    }
}

class invaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }
    draw() {
        context.fillStyle = 'white'
        context.fillRect(this.position.x, this.position.y, 
            this.width, this.height)
         
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        };


        const image = new Image();
        image.src = './assets/ship (5).png';
        image.onload = () => {
            console.log("Image loaded:", image.width, "x", image.height);
            const scale = 0.1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            };
        };
    }

    draw() {

        context.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update({velocity}) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
    shoot(invaderProjectiles) {
        invaderProjectiles.push(new invaderProjectile({
            position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 6
            }
        }))
    }
}
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = {
            x: isMobile ? 1 : 3, 
            y: 0
        };
        this.invaders = [];

        const rows = isMobile ? 2 : Math.floor(Math.random() * 10 + 5);
        const columns = Math.floor(Math.random() * 5 + 5)

        this.width = columns * 34

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
            this.invaders.push(
                new Invader({
                    position: {
            x: x * 34,
            y: y * 32
           }
         })
      )
     }
        console.log(this.invaders)
    }
  }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 32
        }
    }
}
// new Player() is its own instance or reference in memory
const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = []
const particles = []
const keys = {
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    Space: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
    ArrowDown: {
        pressed: false,
    },
};

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
    over: false,
    active: true 
}
let score = 0

for(let i = 0; i < 100; i++) {
    particles.push(
      new Particle({
              position: {
                  x: Math.random() * canvas.width,
                  y: Math.random() * canvas.height
              },
              velocity: {
                  x: 0,
                  y: 0.3
              },
              radius: Math.random() * 3,
              color:'white'
            })
           )
          } 
function createParticles ({object, color, fades}) {
    for(let i = 0; i < 15; i++) {
        particles.push(
          new Particle({
                  position: {
                      x: object.position.x + object.width / 2,
                      y: object.position.y + object.height / 2
                  },
                  velocity: {
                      x: (Math.random() -0.5) * 2,
                      y: (Math.random() -0.5) * 2
                  },
                  radius: Math.random() * 3,
                  color: color || 'red',
                  fades: fades
                })
               )
              } 
}

let isMoving = false;
let moveDirection = { x: 0, y: 0 };


// Game loop to handle movement based on joystick direction
function animate() {
    if (!game.active) {
        resultElement.innerHTML = score + '<br> Winner!';
        return;
    }
  
    requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

   
    if (isMoving) {
        player.velocity.x = moveDirection.x * 7; // Adjust speed as needed
        player.rotation = moveDirection.x > 0 ? 0.3 : (moveDirection.x < 0 ? -0.3 : 0);
    } else {
        player.velocity.x = 0; 
        player.rotation = 0; 
    }

    particles.forEach((particle, index) => {
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = -particle.radius;
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(index, 1);
            }, 0);
        } else {
            particle.update();
        }
    });



    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position && invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1);
            }, 0);
        } else if (invaderProjectile) {
            invaderProjectile.update();
        }
        // projectile hits player
        if (
            invaderProjectile.position &&
            player.position.x < invaderProjectile.position.x + invaderProjectile.width &&
            player.position.x + player.width > invaderProjectile.position.x &&
            player.position.y < invaderProjectile.position.y + invaderProjectile.height &&
            player.position.y + player.height > invaderProjectile.position.y
        ) {
            console.log('You lose!');

            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0);

            setTimeout(() => {
               game.active = false
            }, 2000);

            createParticles ({
                object: player,
                color: 'white',
                fades: true
            }) 
        }   
    });
    
    // projectiles hit enemy
    projectiles.forEach((projectile, index ) => {
        if(projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
            projectiles.splice(index, 1)  
            }, 0)
        } else {
        projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()

            //spawn enemies
    if (frames % 100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.
            length)].shoot(
                invaderProjectiles
                )
    }

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})
            
            projectiles.forEach((projectile, j) => {
                if (
                invader.position &&
                    projectile.position.y - projectile.radius <=
                invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                invader.position.x &&
                    projectile.position.x - projectile.radius <=
                invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >=
                invader.position.y
                ) {
                  
                        setTimeout(() => {
                            const invaderFound = grid.invaders.find(
                                (invader2) =>
                                invader2 === invader
                                )
                            const projectileFound = projectiles.find(
                                projectile2 => projectile2 === projectile
                                 )
                                // remove invader and projectile
                            if (invaderFound && projectileFound) { 
                                score += 100
                                scoreEl.innerHTML = score 
                            createParticles ({
                                object: invader,
                                fades: true
                            })              
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                            
                              if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.
                                    invaders.length - 1]
                                    grid.width = lastInvader.position.x -
                                    firstInvader.position.x + 
                                    lastInvader.width
                                    grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                                }
                        }, 0)
                    }
            })
        })
    })

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -7;
        player.rotation = -0.3;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7;
        player.rotation = 0.3;
    } else if (keys.ArrowUp.pressed && player.position.y >= canvas.height / 2) {
        player.velocity.y = -7;
    } else if (keys.ArrowDown.pressed && player.position.y + player.height <= canvas.height) {
        player.velocity.y = 7;
    } else {
        player.velocity.x = 0;
        player.velocity.y = 0;
        player.rotation = 0;
    }

    //spawning enemies
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 500) + 500)
        frames = 0
    }
   
    frames++
}

animate();

addEventListener('keydown', ({ key }) => {
    if (game.over) return
    switch (key) {
        case 'ArrowLeft':
            console.log('Left arrow pressed');
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            console.log('Right arrow pressed');
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowUp':
            console.log('Up arrow pressed');
            keys.ArrowUp.pressed = true;
            break;
        case 'ArrowDown':
            console.log('Down arrow pressed');
            keys.ArrowDown.pressed = true;
            break;
        case ' ':
            console.log('Spacebar pressed');
            projectiles.push(
                new Projectiles({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -5
                }
            })
            )
            keys.Space.pressed = true;
            break;
    }
});

const joystickContainer = document.getElementById('joystickContainer');
const joystick = document.getElementById('joystick');



// Handle joystick touch start
joystickContainer.addEventListener('touchstart', (event) => {
    isMoving = true;
    moveJoystick(event);
}, { passive: true });


// Handle joystick touch move
joystickContainer.addEventListener('touchmove', (event) => {
    moveJoystick(event);
});

// Handle joystick touch end
joystickContainer.addEventListener('touchend', () => {
    isMoving = false;
    joystick.style.transform = 'translate(0, 0)'; 
    moveDirection = { x: 0, y: 0 }; 
});


function moveJoystick(event) {
    event.preventDefault(); 

    const touch = event.touches[0];
    const containerRect = joystickContainer.getBoundingClientRect();

    // Calculate joystick position
    let x = touch.clientX - containerRect.left - (joystickContainer.offsetWidth / 2);
    let y = touch.clientY - containerRect.top - (joystickContainer.offsetHeight / 2);

    // Limit joystick movement
    const maxDistance = 40; 
    const distance = Math.sqrt(x * x + y * y);

    if (distance > maxDistance) {
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * maxDistance;
        y = Math.sin(angle) * maxDistance;
    }

    joystick.style.transform = `translate(${x}px, ${y}px)`;

    // Calculate movement direction
    moveDirection.x = x / maxDistance;
    moveDirection.y = y / maxDistance;
}

const shootButton = document.getElementById('shootButton');
if (shootButton) {
    shootButton.addEventListener('click', () => {
        projectiles.push(
            new Projectiles({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -5
                }
            })
        );
    });
} else {
    console.error('Shoot button not found');
}

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            console.log('Left arrow released');
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            console.log('Right arrow released');
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            console.log('Up arrow released');
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowDown':
            console.log('Down arrow released');
            keys.ArrowDown.pressed = false;
            break;
        case 'Space':
            console.log('Spacebar released');
            keys.Space.pressed = false;
            break;
    }
});

const restartButton = document.getElementById('restartButton');

restartButton.addEventListener('click', () => {
    location.reload();
});




