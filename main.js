const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const body = document.body;

canvas.width = body.clientWidth * 0.75;
canvas.height = body.clientHeight * 0.75;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };

        this.rotation = 0;

        const image = new Image();
        image.src = './assets/fighter.png';
        image.onload = () => {
            console.log("Image loaded:", image.width, "x", image.height);
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };
    }

    draw() {
        context.save();

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

class invaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }
    draw() {
        context.fillStyle = 'white'
        context.fillRect(this.position.x,this.position.y, 
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
}
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = {
            x: 3,
            y: 0
        };
        this.invaders = [];

        const rows = Math.floor(Math.random() * 10 + 5)
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

const player = new Player();
const projectiles = [];
const grids = [];
const keys = {
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    Space: {
        pressed: false,
    }
};

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)


function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
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
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})
            
            projectiles.forEach((projectile, j) => {
                if (
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
        player.velocity.x = -5;
        player.rotation = -0.3;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 5;
        player.rotation = 0.3;
    } else {
        player.velocity.x = 0;
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
    switch (key) {
        case 'ArrowLeft':
            console.log('Left arrow pressed');
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            console.log('Right arrow pressed');
            keys.ArrowRight.pressed = true;
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
        case 'Space':
            console.log('Spacebar released');
            keys.Space.pressed = false;
            break;
    }
});
