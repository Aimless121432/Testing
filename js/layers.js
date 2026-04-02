addLayer("T", {
    name: "Titan",
    symbol: "T",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10),
    resource: "titan points",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
   
    hotkeys: [
        {key: "t", description: "T: Reset for titan points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    layerShown(){return true},
      
    
    upgrades: {
            11: {
                title: "Upgrade 1",
                description: "Make point gain faster.",
                cost: new Decimal(10),
            },
            12: {
                title: "Upgrade 2",
                description: "Make titan point gain faster.",
                cost: new Decimal(15),
        },

    },

    }
);