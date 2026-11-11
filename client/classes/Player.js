// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle


export default class Player {
    times = [];

    constructor(name) {
        this.name = name;


    }

    recordTime(start, end) {
        const duration = end - start;
        this.times.push(duration);

    }

    showStats() {
        if (this.times.length === 0) {
            console.log("No riddles solved yet.");
            return;
        }

        let totalTime = 0;

        for (const time of this.times) {
            totalTime += time;
        }

        const averageTime = totalTime / this.times.length;
        

        console.log(`Total time: ${(totalTime / 1000).toFixed(2)} seconds`);
        console.log(`Average time: ${(averageTime / 1000).toFixed(2)} seconds`);


    }

}