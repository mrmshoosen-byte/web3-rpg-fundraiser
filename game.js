// RPG Game Logic

class RPGGame {
    constructor() {
        this.currentFloor = 1;
        this.maxFloors = 10;
        this.player = this.initPlayer();
    }

    initPlayer() {
        return {
            name: 'Hero',
            hp: 100,
            attackPower: 10,
            level: 1,
            experience: 0,
            items: []
        };
    }

    nextFloor() {
        if (this.currentFloor < this.maxFloors) {
            this.currentFloor++;
            console.log(`Welcome to floor ${this.currentFloor}!`);
            this.startBattle();
        } else {
            console.log('Congratulations! You have completed all floors.');
        }
    }

    startBattle() {
        const enemy = this.createEnemy();
        console.log(`A wild ${enemy.name} appeared!`);
        this.battle(this.player, enemy);
    }

    createEnemy() {
        const enemies = [
            { name: 'Goblin', hp: 30, attackPower: 5 },
            { name: 'Orc', hp: 50, attackPower: 8 },
            { name: 'Dragon', hp: 120, attackPower: 15 }
        ];
        return enemies[Math.floor(Math.random() * enemies.length)];
    }

    battle(player, enemy) {
        console.log(`Player HP: ${player.hp}, Enemy HP: ${enemy.hp}`);
        while (player.hp > 0 && enemy.hp > 0) {
            enemy.hp -= player.attackPower;
            console.log(`You hit the ${enemy.name} for ${player.attackPower} damage!`);
            if (enemy.hp <= 0) {
                console.log(`You defeated the ${enemy.name}!`);
                player.experience += 10;
                break;
            }
            player.hp -= enemy.attackPower;
            console.log(`The ${enemy.name} hit you for ${enemy.attackPower} damage!`);
            if (player.hp <= 0) {
                console.log('You have been defeated. Game over.');
            }
        }
        this.nextFloor();
    }
}

const game = new RPGGame();
console.log('Starting RPG Game...');
game.nextFloor();