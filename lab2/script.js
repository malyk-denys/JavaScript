"use strict";

// 1.2.3
const car1 = new Object();
car1.color = "black";
car1.maxSpeed = 220;
car1.driver = new Object();
car1.driver.name = "Denys Malyk";
car1.driver.category = "C";
car1.driver["personal limitations"] = "No driving at night";
car1.tuning = true;
car1["number of accidents"] = 0;

console.log("1.2.3 car1 =", car1);

// 1.2.4
const car2 = {
  color: "silver",
  maxSpeed: 190,
  driver: {
    name: "Denys Malyk",
    category: "B",
    "personal limitations": null,
  },
  tuning: false,
  "number of accidents": 2,
};

console.log("1.2.4 car2 =", car2);

// 1.2.5
car1.drive = function () {
  console.log("I am not driving at night");
};

console.log("1.2.5 car1.drive():");
car1.drive();

// 1.2.6
car2.drive = function () {
  console.log("I can drive anytime");
};

console.log("1.2.6 car2.drive():");
car2.drive();

// 1.2.7
function Truck(color, weight, avgSpeed, brand, model) {
  this.color = color;
  this.weight = weight;
  this.avgSpeed = avgSpeed;
  this.brand = brand;
  this.model = model;

  // 1.2.9
  this.trip = function () {
    if (!this.driver) {
      console.log("No driver assigned");
      return;
    }

    const name = this.driver.name;
    const night = this.driver.nightDriving ? "drives at night" : "does not drive at night";
    const exp = this.driver.experience;

    console.log(`Driver ${name} ${night} and has ${exp} years of experience`);
  };
}

// 1.2.8
Truck.prototype.AssignDriver = function (name, nightDriving, experience) {
  this.driver = {
    name: name,
    nightDriving: Boolean(nightDriving),
    experience: parseInt(experience, 10),
  };
};

// 1.2.10
const truck1 = new Truck("blue", 8000, 75.5, "Volvo", "FH");
const truck2 = new Truck("white", 6500, 68.2, "MAN", "TGX");

truck1.AssignDriver("Denys Malyk", true, 5);
truck2.AssignDriver("Denys Malyk", false, 2);

console.log("1.2.10 truck1.trip():");
truck1.trip();

console.log("1.2.10 truck2.trip():");
truck2.trip();

const truck3 = new Truck("red", 7000, 70.0, "Scania", "R500");
console.log("1.2.9/1.2.10 truck3.trip():");
truck3.trip();

// 1.2.12–1.2.15
class Square {
  a;

  constructor(a) {
    this.a = parseInt(a, 10);
  }

  static help() {
    console.log(
      "Square: a quadrilateral with 4 equal sides and 4 right angles (90°). Perimeter = 4a, Area = a^2."
    );
  }

  length() {
    console.log(`Perimeter (sum of side lengths) = ${4 * this.a}`);
  }

  square() {
    console.log(`Area = ${this.a ** 2}`);
  }

  info() {
    console.log("=== Square info ===");
    console.log(`Sides: ${this.a}, ${this.a}, ${this.a}, ${this.a}`);
    console.log("Angles: 90°, 90°, 90°, 90°");
    console.log(`Perimeter = ${4 * this.a}`);
    console.log(`Area = ${this.a ** 2}`);
  }
}

// 1.2.16–1.2.17
class Rectangle extends Square {
  b;

  constructor(a, b) {
    super(a);
    this.b = parseInt(b, 10);
  }

  static help() {
    console.log(
      "Rectangle: a quadrilateral with opposite sides equal and 4 right angles (90°). Perimeter = 2(a+b), Area = a*b."
    );
  }

  length() {
    console.log(`Perimeter (sum of side lengths) = ${2 * (this.a + this.b)}`);
  }

  square() {
    console.log(`Area = ${this.a * this.b}`);
  }

  info() {
    console.log("=== Rectangle info ===");
    console.log(`Sides: ${this.a}, ${this.b}, ${this.a}, ${this.b}`);
    console.log("Angles: 90°, 90°, 90°, 90°");
    console.log(`Perimeter = ${2 * (this.a + this.b)}`);
    console.log(`Area = ${this.a * this.b}`);
  }
}

// 1.2.18–1.2.19
class Rhombus extends Square {
  alpha;
  beta;

  constructor(a, alpha, beta) {
    super(a);
    this.alpha = parseInt(alpha, 10);
    this.beta = parseInt(beta, 10);
  }

  static help() {
    console.log(
      "Rhombus: a quadrilateral with 4 equal sides; opposite angles equal. Perimeter = 4a. Area = a^2 * sin(beta) (beta in degrees)."
    );
  }

  length() {
    console.log(`Perimeter (sum of side lengths) = ${4 * this.a}`);
  }

  square() {
    const betaRad = (this.beta * Math.PI) / 180;
    const area = this.a * this.a * Math.sin(betaRad);
    console.log(`Area = ${area}`);
  }

  info() {
    console.log("=== Rhombus info ===");
    console.log(`Sides: ${this.a}, ${this.a}, ${this.a}, ${this.a}`);
    console.log(`Angles: ${this.alpha}°, ${this.beta}°, ${this.alpha}°, ${this.beta}°`);
    console.log(`Perimeter = ${4 * this.a}`);
    const betaRad = (this.beta * Math.PI) / 180;
    const area = this.a * this.a * Math.sin(betaRad);
    console.log(`Area = ${area}`);
  }
}

// 1.2.20–1.2.21
class Parallelogram extends Rectangle {
  alpha;
  beta;

  constructor(a, b, alpha, beta) {
    super(a, b);
    this.alpha = parseInt(alpha, 10);
    this.beta = parseInt(beta, 10);
  }

  static help() {
    console.log(
      "Parallelogram: opposite sides parallel and equal, opposite angles equal. Perimeter = 2(a+b). Area = a*b*sin(beta) (beta in degrees)."
    );
  }

  length() {
    console.log(`Perimeter (sum of side lengths) = ${2 * (this.a + this.b)}`);
  }

  square() {
    const betaRad = (this.beta * Math.PI) / 180;
    const area = this.a * this.b * Math.sin(betaRad);
    console.log(`Area = ${area}`);
  }

  info() {
    console.log("=== Parallelogram info ===");
    console.log(`Sides: ${this.a}, ${this.b}, ${this.a}, ${this.b}`);
    console.log(`Angles: ${this.alpha}°, ${this.beta}°, ${this.alpha}°, ${this.beta}°`);
    console.log(`Perimeter = ${2 * (this.a + this.b)}`);
    const betaRad = (this.beta * Math.PI) / 180;
    const area = this.a * this.b * Math.sin(betaRad);
    console.log(`Area = ${area}`);
  }
}

// 1.2.22
Object.defineProperties(Rhombus.prototype, {
  sideA: {
    get() {
      return this.a;
    },
    set(value) {
      this.a = parseInt(value, 10);
    },
  },
  angleAlpha: {
    get() {
      return this.alpha;
    },
    set(value) {
      this.alpha = parseInt(value, 10);
    },
  },
  angleBeta: {
    get() {
      return this.beta;
    },
    set(value) {
      this.beta = parseInt(value, 10);
    },
  },
});

// 1.2.23
console.log("1.2.23 help() calls:");
Square.help();
Rectangle.help();
Rhombus.help();
Parallelogram.help();

// 1.2.24
const sq = new Square(5);
const rect = new Rectangle(6, 4);
const rh = new Rhombus(7, 120, 60);
const para = new Parallelogram(8, 3, 130, 50);

console.log("1.2.24 info() calls:");
sq.info();
rect.info();
rh.info();
para.info();

// 1.2.25
function Triangular(a = 3, b = 4, c = 5) {
  const [A, B, C] = [a, b, c].map((x) => parseInt(x, 10));
  return { a: A, b: B, c: C };
}

// 1.2.26
console.log("1.2.26 Triangular objects:");
const t1 = Triangular();
const t2 = Triangular(6, 8, 10);
const t3 = Triangular(5, 5, 8);
console.log(t1, t2, t3);

// 1.2.27
function PiMultiplier(x) {
  const k = Number(x);
  return function () {
    return Math.PI * k;
  };
}

// 1.2.28
console.log("1.2.28 PiMultiplier results:");
const mul2 = PiMultiplier(2);
const mul3div2 = PiMultiplier(3 / 2);
const div2 = PiMultiplier(1 / 2);

console.log("pi*2 =", mul2());
console.log("pi*(3/2) =", mul3div2());
console.log("pi/2 =", div2());

// 1.2.29
function Painter(color) {
  const c = String(color);
  return function (obj) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, "type")) {
      console.log(`color: ${c}, type: ${obj.type}`);
    } else {
      console.log("No ‘type’ property occurred!");
    }
  };
}

// 1.2.30
const PaintBlue = Painter("blue");
const PaintRed = Painter("red");
const PaintYellow = Painter("yellow");

// 1.2.31
const obj1 = { maxSpeed: 280, type: "Sportcar", color: "magenta" };
const obj2 = { type: "Truck", "avg speed": 90, "load capacity": 2400 };
const obj3 = { maxSpeed: 180, color: "purple", isCar: true };

console.log("1.2.31 Painter tests:");

console.log("PaintBlue on obj1/obj2/obj3:");
PaintBlue(obj1);
PaintBlue(obj2);
PaintBlue(obj3);

console.log("PaintRed on obj1/obj2/obj3:");
PaintRed(obj1);
PaintRed(obj2);
PaintRed(obj3);

console.log("PaintYellow on obj1/obj2/obj3:");
PaintYellow(obj1);
PaintYellow(obj2);
PaintYellow(obj3);
