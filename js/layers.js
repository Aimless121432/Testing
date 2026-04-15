addLayer("a", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='resources/trophy.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>", // This appears on the layer's node. Default is the id with the first letter capitalized 
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
       
    }
    },
    nodeStyle: {
        background: "linear-gradient(45deg, blue, purple)",
        "background-origin": "border-box",
    },
    color: "blue",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    tooltip: "Achievements", // Row the layer is in on the tree (0 is the first row)
    
    layerShown() {
        return true
    }
})

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
         let mult = new Decimal(1)
        if (hasUpgrade('T', 13)) mult = mult.times(upgradeEffect('T', 13))
        if (hasUpgrade('V', 12)) mult = mult.times(2)
        if (hasUpgrade('V', 14)) mult = mult.times(2)
            return mult
    },

    gainExp() {
        return new Decimal(1)
    },
    row: 0,
   
    hotkeys: [
        {key: "t", description: "T: Reset for titan points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
     
    doReset(resettingLayer) {
    // Stage 1, almost always needed, makes resetting this layer not delete your progress
    if (layers[resettingLayer].row <= this.row) return;

    // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
    let keptUpgrades = [];
    if (hasUpgrade(this.layer, 11,12,13,14)) keptUpgrades.push(11,12,13,14);

    // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
    let keep = [];
    

    // Stage 4, do the actual data reset
    layerDataReset(this.layer, keep);

    // Stage 5, add back in the specific subfeatures you saved earlier
    player[this.layer].upgrades.push(...keptUpgrades);
  }, 
    
    upgrades: {
            11: {
                title: "Upgrade 1",
                description: "Make point gain faster.",
                cost: new Decimal(1),
            },
            12: {
                  effect() {
        return player[this.layer].points.add(1).pow(0.5)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        
    title: "Upgrade 2",
    description: "Make point gain based on titan points.",
    cost: new Decimal(5)
},
13: {
    effect() {
        return player.points.add(1).pow(0.15)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
                title: "Upgrade 3",
                description: "points boost titan points.",
                cost: new Decimal(10),
            },
    14: {
        title: "Upgrade 4",
        description: "Unlocks a new layer and 1.5x point gain.",
        cost: new Decimal(25),
        },
    
        15: {
        title: "Upgrade 5",
        description: "2x point gain.",
        cost: new Decimal(10000),
            unlocked() {
        return hasMilestone('V', 1)
    },
},
    16: { 
        title: "Upgrade 6",
        description: "1.5x Victor point gain.",
        cost: new Decimal(1e5),
        unlocked() {
        return hasMilestone('V', 1)
    },
},
},
});

addLayer("V", {
    name: "Victor Points",
    symbol: "V",
    position: 1,
    startData() { return {
    unlocked: false,  
    points: new Decimal(0),
    
    }},
    color: "#a80e0e",
    requires: new Decimal(50),
    resource: "Victor points",
    baseResource: "Titan points",
    baseAmount() {return player.T.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
    let mult = new Decimal(1)
if (hasUpgrade('T', 16)) mult = mult.times(2)
    
    return mult
    },

    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "v", description: "V: Reset for victor points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){ 
    return hasUpgrade('T', 14) || (player.V.unlocked), visible = true
    }, 
    
layerShown(){
        let visible = false
        if (hasUpgrade('T', 14) || player.V.unlocked) visible = true
       return visible
     },
    
     upgrades: {
    11: {
        title: "Boxing Day ",
        description: "Make point gain faster.",
        cost: new Decimal(1),
    },
    12: {
        title: "Practice",
        description: "2x Titan point gain.", 
        cost: new Decimal(5),
    },
    13: {
        title: "Upgrade 3",
        description: "Unlocks challenge",
        onPurchase() {player.V.challenges[11].unlocked = true},
        cost: new Decimal(3),
    },
    14: {
        title: "ACL tear",
        description: ".25x point gain, but 2x titan point gain.",
        cost: new Decimal(10),
    },
},
challenges: {
    11: {
        name: "Sparring",
        challengeDescription: "Do a sparring match",
        canComplete: function() {return player.points.gte(500)},
        goalDescription: "Get 500 points.",
        rewardDescription: "Make point gain based on victor points and unlock a new milestone.",
        Inchallenge() {return true},
        effect() {
        return player[this.layer].points.add(1).pow(0.75)
    },
    effectDisplay() { return format(challengeEffect(this.layer, this.id))+"x" },
unlocked() {
        return (hasUpgrade('V', 13))
},
},
   
},
    
    milestones: {
        0: {
            requirementDescription: "10 Victor points",
            effectDescription: "Keep 1-4 titan upgrades on victor reset.",
            done() {
                return player[this.layer].points.gte(10)
            },
        },
   1: {
            requirementDescription: "100 Victor points",
            effectDescription: "Unlock new Titan upgrades",
            done() {
                return player[this.layer].points.gte(100)
            },
    },
},
});



