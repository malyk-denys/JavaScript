// ===== Інструкція =====
console.log("Функція: triangle(value1, type1, value2, type2)");
console.log("Доступні типи:");
console.log("leg – катет");
console.log("hypotenuse – гіпотенуза");
console.log("adjacent angle – прилеглий до катета кут (у градусах)");
console.log("opposite angle – протилежний до катета кут (у градусах)");
console.log("angle – гострий кут (коли задана гіпотенуза)");
console.log("Кути задаються у градусах");

// ===== Допоміжні функції =====
function toRad(deg) {
    return deg * Math.PI / 180;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}

// ===== Основна функція =====
function triangle(v1, t1, v2, t2) {

    const validTypes = [
        "leg",
        "hypotenuse",
        "adjacent angle",
        "opposite angle",
        "angle"
    ];

    // Перевірка типів
    if (!validTypes.includes(t1) || !validTypes.includes(t2) || t1 === t2) {
        console.log("Невірні або несумісні типи аргументів. Перечитайте інструкцію.");
        return "failed";
    }

    // Перевірка значень
    if (v1 <= 0 || v2 <= 0) {
        return "Значення повинні бути додатними";
    }

    // Збір аргументів
    const args = {};
    args[t1] = v1;
    args[t2] = v2;

    let a, b, c, alpha, beta;

    try {
        // === Катет + гіпотенуза ===
        if (args["leg"] && args["hypotenuse"]) {
            a = args["leg"];
            c = args["hypotenuse"];

            if (a >= c) return "Катет не може бути більшим або рівним гіпотенузі";

            b = Math.sqrt(c * c - a * a);
            alpha = Math.asin(a / c);
            beta = Math.asin(b / c);
        }

        // === Катет + протилежний кут ===
        else if (args["leg"] && args["opposite angle"]) {
            a = args["leg"];
            alpha = toRad(args["opposite angle"]);

            if (alpha <= 0 || alpha >= Math.PI / 2)
                return "Кут повинен бути гострим";

            c = a / Math.sin(alpha);
            b = Math.sqrt(c * c - a * a);
            beta = Math.asin(b / c);
        }

        // === Катет + прилеглий кут ===
        else if (args["leg"] && args["adjacent angle"]) {
            a = args["leg"];
            beta = toRad(args["adjacent angle"]);

            if (beta <= 0 || beta >= Math.PI / 2)
                return "Кут повинен бути гострим";

            c = a / Math.cos(beta);
            b = Math.sqrt(c * c - a * a);
            alpha = Math.asin(a / c);
        }

        // === Гіпотенуза + кут ===
        else if (args["hypotenuse"] && args["angle"]) {
            c = args["hypotenuse"];
            alpha = toRad(args["angle"]);

            if (alpha <= 0 || alpha >= Math.PI / 2)
                return "Кут повинен бути гострим";

            a = c * Math.sin(alpha);
            b = c * Math.cos(alpha);
            beta = Math.asin(b / c);
        }

        else {
            console.log("Несумісна пара типів. Перечитайте інструкцію.");
            return "failed";
        }

        // ===== Вивід результатів =====
        console.log("Результат:");
        console.log("a =", a.toFixed(4));
        console.log("b =", b.toFixed(4));
        console.log("c =", c.toFixed(4));
        console.log("alpha =", toDeg(alpha).toFixed(2), "градусів");
        console.log("beta =", toDeg(beta).toFixed(2), "градусів");

        return "success";

    } catch (e) {
        return "Помилка обчислення";
    }
}

