new (class Control {
    #viewA;
    #viewB;

    constructor() {
        const root = d3.select('body').append('div');

        this.#viewA = new Exo(this, root);
        this.#viewB = new Scatter(this, root);
    }

    Test(str) {
        console.log(str);
    }
    
    Update(str) {
        this.#viewB.setResultText(str);
    }
})()