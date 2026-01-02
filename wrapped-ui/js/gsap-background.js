// GSAP Background Animation
// Adapted from https://www.gabrielfleury.design

const panels = document.querySelectorAll(".panel1");
const secondaryPanels = document.querySelectorAll(".panel2");
const numberOfPanels = 12;
const rotationCoef = 5;
let elHeight = window.innerHeight / numberOfPanels;
let elWidth = window.innerWidth / numberOfPanels;

var tl = gsap.timeline({ repeat: -1 });

window.addEventListener("resize", (event) => {
    elHeight = window.innerHeight / numberOfPanels;
    elWidth = window.innerWidth / numberOfPanels;
    tl.clear();
    addItemsToTimeline();
    tl.progress(0);
});

addItemsToTimeline();

// GSAP animations for background panels
function addItemsToTimeline() {
    panels.forEach((panel, i) => {
        const stopPosition = 100 - i * 1;
        const wi = window.innerWidth - elWidth * (12 - i) + elWidth;
        const he = window.innerHeight - elHeight * (12 - i) + elHeight;

        // Initial rotation
        tl.fromTo(
            panel,
            {
                y: elHeight * 5.5,
                x: elWidth * 5.5,
                width: 0,
                height: 0,
                rotation: -360,
                background: `linear-gradient(105deg,rgba(43, 108, 238, 0.03) 0%,rgba(43, 108, 238, 0.05) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) ${stopPosition}%)`
            },
            {
                width: wi,
                height: he,
                y: -elHeight / 1.33 + ((12 - i) * elHeight) / 1.33,
                x: 0,
                duration: 1 + 0.1 * (12 - i),
                ease: "sine.inOut",
                rotation: 0,
                background: `linear-gradient(105deg,rgba(43, 108, 238, 0.03) 0%,rgba(43, 108, 238, 0.05) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) ${stopPosition}%)`
            },
            0
        );

        // Linear rotation
        tl.to(
            panel,
            {
                rotation: 12 * rotationCoef - (i + 1) * rotationCoef,
                duration: 3,
                background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) ${stopPosition}%)`,
                ease: "linear"
            },
            ">"
        );

        // Reordering
        tl.to(
            panel,
            {
                rotation: 360,
                y: -elHeight / 6 + ((12 - i) * elHeight) / 6,
                x: -elWidth / 1.2 + ((12 - i) * elWidth) / 1.2,
                background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                ease: "sine.inOut",
                duration: 1
            },
            ">"
        );

        // Linear rotation 2
        tl.to(
            panel,
            {
                rotation: 12 * rotationCoef - (i + 1) * rotationCoef + 360,
                duration: 4,
                background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                ease: "linear"
            },
            ">"
        );

        if (i == 0) {
            tl.addLabel("splitStart", "-=0.8");
        }

        secondaryPanels.forEach((twoPanel, index) => {
            const wi2 = window.innerWidth - elWidth * index + elWidth;
            const he2 = window.innerHeight - elHeight * index + elHeight;

            tl.fromTo(
                twoPanel,
                {
                    y: elHeight * 5.5,
                    x: elWidth * 5.5,
                    width: 0,
                    height: 0,
                    rotation: -360,
                    background: `linear-gradient(105deg,rgba(43, 108, 238, 0.03) 0%,rgba(43, 108, 238, 0.05) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`
                },
                {
                    rotation: -90,
                    y: 0 + (index * elHeight) / 4 - wi2,
                    x: -elWidth / 2 + (index * elWidth) / 2,
                    width: wi2,
                    height: wi2,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "sine.inOut",
                    duration: 1
                },
                "splitStart" + "+=" + String(0.05 * index)
            );

            tl.to(
                twoPanel,
                {
                    rotation: 12 * rotationCoef - (12 - index) * rotationCoef - 90,
                    duration: 5,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "linear"
                },
                ">"
            );

            tl.to(
                twoPanel,
                {
                    rotation: 300,
                    y: 0 + (index * elHeight) / 2 - wi2,
                    x: (window.innerWidth * 1.1 - wi2 * 1.2),
                    width: wi2,
                    height: wi2,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "sine.inOut",
                    duration: 1
                },
                ">"
            );

            tl.to(
                twoPanel,
                {
                    rotation: "+=15",
                    duration: 5,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "linear"
                },
                ">"
            );

            tl.to(
                twoPanel,
                {
                    rotation: "+=360",
                    y: "-=" + String(wi2 * 2),
                    x: "+=" + String(wi2 * 2),
                    width: wi2,
                    height: wi2,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "sine.inOut",
                    duration: 1
                },
                ">"
            );
        });

        if (i == 0) {
            tl.to(
                panel,
                {
                    rotation: 720 + 90,
                    y: window.innerHeight - ((12 - i) * elHeight) / 4,
                    x: -elWidth / 2 + ((12 - i) * elWidth) / 2,
                    width: 0,
                    height: 0,
                    opacity: 0,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "sine.inOut",
                    duration: 1
                },
                "splitStart" + "+=" + String(0.05 * i)
            );
        } else {
            tl.to(
                panel,
                {
                    rotation: 720 + 90,
                    y: window.innerHeight - ((12 - i) * elHeight) / 4,
                    x: -elWidth / 2 + ((12 - i) * elWidth) / 2,
                    width: wi,
                    height: wi,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "sine.inOut",
                    duration: 1
                },
                "splitStart" + "+=" + String(0.05 * i)
            );

            tl.to(
                panel,
                {
                    rotation: (12 * rotationCoef - (i + 1) * rotationCoef) / 1.2 + 810,
                    duration: 5,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "linear"
                },
                ">"
            );

            tl.to(
                panel,
                {
                    y: window.innerHeight - ((12 - i) * elHeight) / 2,
                    x: 0 - elWidth * 1.2,
                    rotation: (12 * rotationCoef - (i + 1) * rotationCoef) / 1.2 + 1180,
                    ease: "sine.inOut",
                    duration: 1,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "sine.inOut"
                },
                ">"
            );

            tl.to(
                panel,
                {
                    rotation: (12 * rotationCoef - (i + 1) * rotationCoef) / 1.2 + 1200,
                    duration: 5,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "linear"
                },
                ">"
            );

            tl.to(
                panel,
                {
                    y: "+=" + String(elHeight * 4),
                    x: "-=" + String(elWidth * 4),
                    rotation: (12 * rotationCoef - (i + 1) * rotationCoef) / 1.2 + 1500,
                    ease: "sine.inOut",
                    duration: 1,
                    background: `linear-gradient(90deg,rgba(43, 108, 238, 0.04) 0%,rgba(43, 108, 238, 0.06) 6%,rgba(43, 108, 238, 0.08) 19%,rgba(43, 108, 238, 0.1) 72%,rgba(0, 0, 0, 0) 100%)`,
                    ease: "sine.inOut"
                },
                ">"
            );
        }
    });
}
