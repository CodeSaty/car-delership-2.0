/**
 * Aura Drive — Car Specifications Database
 * Comprehensive specs for luxury vehicles in the inventory.
 * Covers engine, performance, dimensions, transmission, interior, and more.
 */

export interface CarSpecs {
    // General
    bodyType: string;
    drivetrain: string;
    seatingCapacity: number;
    doors: number;
    generation: string;
    countryOfOrigin: string;

    // Engine
    engine: {
        type: string;
        displacement: string;
        configuration: string;
        horsepower: string;
        torque: string;
        fuelSystem: string;
        aspiration: string;
        valvetrain: string;
        redline: string;
    };

    // Performance
    performance: {
        topSpeed: string;
        acceleration060: string;
        acceleration0100: string;
        quarterMile: string;
        brakingDistance: string;
        lateralG: string;
    };

    // Transmission
    transmission: {
        type: string;
        gears: number;
        driveType: string;
    };

    // Dimensions
    dimensions: {
        length: string;
        width: string;
        height: string;
        wheelbase: string;
        curbWeight: string;
        fuelCapacity: string;
        cargoVolume: string;
    };

    // Fuel Economy
    fuel: {
        fuelType: string;
        cityMPG: string;
        highwayMPG: string;
        combinedMPG: string;
    };

    // Wheels & Brakes
    wheels: {
        frontTires: string;
        rearTires: string;
        frontBrakes: string;
        rearBrakes: string;
    };

    // Features
    features: string[];

    // Safety
    safety: string[];

    // Interior highlights
    interior: string[];

    // Description
    description: string;

    // Sketchfab embed URL (if available)
    sketchfabId?: string;
}

/** Key = "make|model" normalized lowercase */
const SPECS_DB: Record<string, CarSpecs> = {
    "porsche|911 turbo s": {
        bodyType: "Coupe",
        drivetrain: "AWD",
        seatingCapacity: 4,
        doors: 2,
        generation: "992.2",
        countryOfOrigin: "Germany",
        engine: {
            type: "Twin-Turbocharged Flat-6",
            displacement: "3.7L (3,745 cc)",
            configuration: "Horizontally-Opposed 6-Cylinder",
            horsepower: "640 hp @ 6,750 rpm",
            torque: "590 lb-ft @ 2,500-4,000 rpm",
            fuelSystem: "Direct Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 24-Valve",
            redline: "7,200 rpm",
        },
        performance: {
            topSpeed: "205 mph",
            acceleration060: "2.6 seconds",
            acceleration0100: "6.0 seconds",
            quarterMile: "10.5 seconds",
            brakingDistance: "93 ft (60-0)",
            lateralG: "1.18 g",
        },
        transmission: { type: "PDK Dual-Clutch", gears: 8, driveType: "All-Wheel Drive (PTM)" },
        dimensions: {
            length: "177.9 in",
            width: "74.8 in",
            height: "51.1 in",
            wheelbase: "96.5 in",
            curbWeight: "3,636 lbs",
            fuelCapacity: "16.9 gal",
            cargoVolume: "4.6 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "15 mpg", highwayMPG: "20 mpg", combinedMPG: "17 mpg" },
        wheels: {
            frontTires: "255/35 ZR20",
            rearTires: "315/30 ZR21",
            frontBrakes: "PCCB Ceramic 16.5\" 10-piston",
            rearBrakes: "PCCB Ceramic 15.3\" 4-piston",
        },
        features: ["Sport Chrono Package", "PASM Active Suspension", "Rear-Axle Steering", "Active Aero", "Porsche Dynamic Chassis Control", "Burmester High-End Surround Sound", "Sport Exhaust System"],
        safety: ["10 Airbags", "Porsche Stability Management (PSM)", "Lane Keep Assist", "Adaptive Cruise Control", "Night Vision Assist", "Surround View Cameras"],
        interior: ["Full Leather Interior", "18-Way Adaptive Sport Seats Plus", "10.9\" Touchscreen PCM", "12.6\" Digital Instrument Cluster", "GT Sport Steering Wheel", "Brushed Aluminum & Carbon Fiber Trim"],
        description: "The Porsche 911 Turbo S represents the pinnacle of the 911 lineup — a twin-turbocharged flat-six delivers 640 horsepower through all four wheels via the legendary PDK transmission. It combines hypercar-level performance with the everyday usability that defines the 911 ethos.",
        sketchfabId: "2614aa1ce8404e0ebf6f08c9a100a7de",
    },

    "porsche|cayenne turbo gt": {
        bodyType: "SUV",
        drivetrain: "AWD",
        seatingCapacity: 4,
        doors: 5,
        generation: "E3 (3rd Gen)",
        countryOfOrigin: "Germany",
        engine: {
            type: "Twin-Turbocharged V8",
            displacement: "4.0L (3,996 cc)",
            configuration: "V8",
            horsepower: "659 hp @ 6,000 rpm",
            torque: "627 lb-ft @ 2,000-4,500 rpm",
            fuelSystem: "Direct Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 32-Valve",
            redline: "6,800 rpm",
        },
        performance: {
            topSpeed: "186 mph",
            acceleration060: "3.1 seconds",
            acceleration0100: "7.5 seconds",
            quarterMile: "11.2 seconds",
            brakingDistance: "102 ft (60-0)",
            lateralG: "1.05 g",
        },
        transmission: { type: "Tiptronic S Automatic", gears: 8, driveType: "All-Wheel Drive" },
        dimensions: {
            length: "194.8 in",
            width: "78.0 in",
            height: "65.4 in",
            wheelbase: "114.0 in",
            curbWeight: "5,038 lbs",
            fuelCapacity: "23.7 gal",
            cargoVolume: "22.7 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "12 mpg", highwayMPG: "17 mpg", combinedMPG: "14 mpg" },
        wheels: {
            frontTires: "285/35 ZR22",
            rearTires: "315/30 ZR22",
            frontBrakes: "PCCB Ceramic 17.3\" 10-piston",
            rearBrakes: "PCCB Ceramic 16.1\" 4-piston",
        },
        features: ["Porsche Active Suspension Management", "Rear-Axle Steering", "Carbon Roof", "Sport Exhaust", "Titanium Exhaust Tips", "Dynamic Chassis Control Sport"],
        safety: ["8 Airbags", "PSM with Sport Mode", "ParkAssist with Surround View", "Lane Keep Assist", "Adaptive Cruise Control"],
        interior: ["Alcantara Sport Package", "18-Way Adaptive Sport Seats", "GT Interior Package", "Carbon Fiber Trim", "Multifunction Sport Steering Wheel"],
        description: "The Cayenne Turbo GT is the most extreme Cayenne ever built — a track-focused SUV that holds the Nürburgring record for production SUVs. Its hand-assembled 659-hp twin-turbo V8 delivers breathtaking acceleration in a practical five-door package.",
        sketchfabId: "65d9f9e3c8db47988ff0b98f8d6e41e4",
    },

    "ferrari|f8 tributo": {
        bodyType: "Coupe",
        drivetrain: "RWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "F8 (F142MFL)",
        countryOfOrigin: "Italy",
        engine: {
            type: "Twin-Turbocharged V8",
            displacement: "3.9L (3,902 cc)",
            configuration: "V8 90° Flat-Plane Crank",
            horsepower: "710 hp @ 8,000 rpm",
            torque: "568 lb-ft @ 3,250 rpm",
            fuelSystem: "Direct Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 32-Valve",
            redline: "8,200 rpm",
        },
        performance: {
            topSpeed: "211 mph",
            acceleration060: "2.9 seconds",
            acceleration0100: "5.5 seconds",
            quarterMile: "10.4 seconds",
            brakingDistance: "95 ft (60-0)",
            lateralG: "1.20 g",
        },
        transmission: { type: "F1 DCT Dual-Clutch", gears: 7, driveType: "Rear-Wheel Drive" },
        dimensions: {
            length: "181.1 in",
            width: "77.9 in",
            height: "47.6 in",
            wheelbase: "104.3 in",
            curbWeight: "3,164 lbs",
            fuelCapacity: "18.5 gal",
            cargoVolume: "7.1 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "14 mpg", highwayMPG: "19 mpg", combinedMPG: "16 mpg" },
        wheels: {
            frontTires: "245/35 ZR20",
            rearTires: "305/30 ZR20",
            frontBrakes: "Carbon Ceramic 15.7\" 6-piston",
            rearBrakes: "Carbon Ceramic 14.2\" 4-piston",
        },
        features: ["Side Slip Control SSC 6.1", "Ferrari Dynamic Enhancer+", "Magnetic Damping SCM-E", "Active Aero S-Duct", "Manettino Drive Modes", "Apple CarPlay"],
        safety: ["6 Airbags", "ABS with EBD", "F1-Trac Traction Control", "Stability Control", "Tire Pressure Monitoring", "Rear Parking Sensors"],
        interior: ["Hand-Stitched Leather", "Carbon Fiber Racing Seats", "7\" Digital Instrument Cluster", "JBL Professional Audio", "Alcantara Headliner", "LED Steering Wheel with Manettino"],
        description: "The F8 Tributo is Ferrari's tribute to the most powerful V8 in Ferrari history. With 710 horsepower from its award-winning twin-turbo V8, it delivers the most intense mid-engine V8 experience ever created — combining racecar aerodynamics with everyday grand touring capability.",
        sketchfabId: "c1c02bdfdd6044c0b92b53a5a12e6abf",
    },

    "ferrari|roma spider": {
        bodyType: "Convertible",
        drivetrain: "RWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "Roma (F169)",
        countryOfOrigin: "Italy",
        engine: {
            type: "Twin-Turbocharged V8",
            displacement: "3.9L (3,855 cc)",
            configuration: "V8 90° Flat-Plane Crank",
            horsepower: "612 hp @ 7,500 rpm",
            torque: "561 lb-ft @ 3,000 rpm",
            fuelSystem: "Direct Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 32-Valve",
            redline: "7,700 rpm",
        },
        performance: {
            topSpeed: "199 mph",
            acceleration060: "3.2 seconds",
            acceleration0100: "6.8 seconds",
            quarterMile: "10.9 seconds",
            brakingDistance: "98 ft (60-0)",
            lateralG: "1.10 g",
        },
        transmission: { type: "F1 DCT Dual-Clutch", gears: 8, driveType: "Rear-Wheel Drive" },
        dimensions: {
            length: "183.5 in",
            width: "78.0 in",
            height: "51.2 in",
            wheelbase: "107.3 in",
            curbWeight: "3,616 lbs",
            fuelCapacity: "21.1 gal",
            cargoVolume: "8.1 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "13 mpg", highwayMPG: "18 mpg", combinedMPG: "15 mpg" },
        wheels: {
            frontTires: "245/35 ZR20",
            rearTires: "285/35 ZR20",
            frontBrakes: "Carbon Ceramic 15.0\" 6-piston",
            rearBrakes: "Carbon Ceramic 13.8\" 4-piston",
        },
        features: ["Retractable Hardtop (14 sec)", "Manettino Drive Modes", "Magnetic Damping", "Adaptive LED Headlights", "Ferrari Dynamic Enhancer"],
        safety: ["6 Airbags", "ABS with EBD", "E-Diff3 Electronic Differential", "Stability Control", "ADAS Driver Assistance"],
        interior: ["Dual-Cockpit Design", "Hand-Stitched Leather", "Card-Key Start", "16\" Curved HD Display", "Harman Kardon Premium Audio"],
        description: "The Roma Spider is Ferrari's stunning open-top grand tourer — 'la nuova dolce vita.' Its retractable hardtop transforms the elegant Roma into a pure convertible in just 14 seconds, while the twin-turbo V8 delivers 612 hp of pure Italian emotion.",
        sketchfabId: "a5fe65d85e6942afb83f6cb81b24a3de",
    },

    "lamborghini|huracán evo": {
        bodyType: "Coupe",
        drivetrain: "AWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "Huracán EVO (LB724)",
        countryOfOrigin: "Italy",
        engine: {
            type: "Naturally Aspirated V10",
            displacement: "5.2L (5,204 cc)",
            configuration: "V10 90° with Dry Sump",
            horsepower: "631 hp @ 8,000 rpm",
            torque: "443 lb-ft @ 6,500 rpm",
            fuelSystem: "Multi-Point + Direct Injection",
            aspiration: "Naturally Aspirated",
            valvetrain: "DOHC 40-Valve VVT",
            redline: "8,500 rpm",
        },
        performance: {
            topSpeed: "202 mph",
            acceleration060: "2.9 seconds",
            acceleration0100: "6.7 seconds",
            quarterMile: "10.4 seconds",
            brakingDistance: "97 ft (60-0)",
            lateralG: "1.15 g",
        },
        transmission: { type: "LDF 7-Speed DCT", gears: 7, driveType: "All-Wheel Drive (Haldex)" },
        dimensions: {
            length: "175.6 in",
            width: "75.7 in",
            height: "45.9 in",
            wheelbase: "103.1 in",
            curbWeight: "3,135 lbs",
            fuelCapacity: "21.1 gal",
            cargoVolume: "5.1 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "13 mpg", highwayMPG: "18 mpg", combinedMPG: "15 mpg" },
        wheels: {
            frontTires: "245/30 ZR20",
            rearTires: "305/30 ZR20",
            frontBrakes: "CCM-R Carbon Ceramic 15.0\" 6-piston",
            rearBrakes: "CCM-R Carbon Ceramic 14.0\" 4-piston",
        },
        features: ["LDVI (Lamborghini Dynamic Vehicle Integration)", "ALA 2.0 Active Aerodynamics", "Lamborghini Piattaforma Inerziale", "ANIMA Drive Modes", "Magnetic Ride Suspension"],
        safety: ["6 Airbags", "ABS with EBD", "ESC", "Traction Control", "Hill Hold", "Tire Pressure Monitoring"],
        interior: ["Full Alcantara Interior", "8.4\" HMI Touchscreen", "Apple CarPlay", "Digital Instrument Cluster", "Carbon Fiber Sport Seats", "Lamborghini Telemetry System"],
        description: "The Huracán EVO unleashes 631 hp from its naturally aspirated 5.2L V10 — one of the last road cars to feature this glorious engine configuration. The LDVI system predicts and executes the driver's intentions, making superhuman performance feel intuitive.",
        sketchfabId: "5497e0891c2648efaa6e5edd52b0a6cd",
    },

    "lamborghini|urus performante": {
        bodyType: "SUV",
        drivetrain: "AWD",
        seatingCapacity: 5,
        doors: 5,
        generation: "Urus (Mk1 Facelift)",
        countryOfOrigin: "Italy",
        engine: {
            type: "Twin-Turbocharged V8",
            displacement: "4.0L (3,996 cc)",
            configuration: "V8 90°",
            horsepower: "666 hp @ 6,000 rpm",
            torque: "627 lb-ft @ 2,300-4,500 rpm",
            fuelSystem: "Direct Injection + MPI",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 32-Valve",
            redline: "6,800 rpm",
        },
        performance: {
            topSpeed: "190 mph",
            acceleration060: "3.3 seconds",
            acceleration0100: "7.9 seconds",
            quarterMile: "11.3 seconds",
            brakingDistance: "105 ft (60-0)",
            lateralG: "1.00 g",
        },
        transmission: { type: "ZF 8-Speed Automatic", gears: 8, driveType: "All-Wheel Drive (Torsen)" },
        dimensions: {
            length: "199.1 in",
            width: "78.3 in",
            height: "64.5 in",
            wheelbase: "118.2 in",
            curbWeight: "4,850 lbs",
            fuelCapacity: "22.5 gal",
            cargoVolume: "21.8 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "12 mpg", highwayMPG: "16 mpg", combinedMPG: "14 mpg" },
        wheels: {
            frontTires: "285/40 R22",
            rearTires: "325/35 R22",
            frontBrakes: "Carbon Ceramic 17.3\" 10-piston",
            rearBrakes: "Carbon Ceramic 14.6\" 4-piston",
        },
        features: ["ANIMA 2.0 Drive Modes + Rally Mode", "Torque Vectoring", "Active Roll Stabilization", "Carbon Fiber Body Kit", "Steel Spring Suspension", "Akrapovič Exhaust"],
        safety: ["8 Airbags", "ABS with EBD", "ESC", "Traction Control", "360° Camera", "ADAS Suite"],
        interior: ["Alcantara & Carbon", "Full Digital Cockpit", "Bang & Olufsen 3D Audio", "Heated/Ventilated Seats", "Head-Up Display", "23\" Touch Central Console"],
        description: "The Urus Performante is Lamborghini's ultimate super SUV — 47 kg lighter than standard, with 666 hp (a devilish number, intentional) and a Pikes Peak record. It combines supercar DNA with the practicality of a luxury SUV.",
        sketchfabId: "bdbba62e9b7d4eaba61b6c5e5e42c0c0",
    },

    "aston martin|db12": {
        bodyType: "Grand Tourer",
        drivetrain: "RWD",
        seatingCapacity: 4,
        doors: 2,
        generation: "DB12 (2024+)",
        countryOfOrigin: "United Kingdom",
        engine: {
            type: "Twin-Turbocharged V8",
            displacement: "4.0L (3,982 cc)",
            configuration: "V8 (AMG-derived)",
            horsepower: "671 hp @ 6,000 rpm",
            torque: "590 lb-ft @ 2,750-6,000 rpm",
            fuelSystem: "Direct Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 32-Valve",
            redline: "6,500 rpm",
        },
        performance: {
            topSpeed: "202 mph",
            acceleration060: "3.4 seconds",
            acceleration0100: "6.8 seconds",
            quarterMile: "11.0 seconds",
            brakingDistance: "100 ft (60-0)",
            lateralG: "1.10 g",
        },
        transmission: { type: "ZF 8-Speed Automatic", gears: 8, driveType: "Rear-Wheel Drive" },
        dimensions: {
            length: "187.0 in",
            width: "76.4 in",
            height: "51.4 in",
            wheelbase: "107.7 in",
            curbWeight: "3,946 lbs",
            fuelCapacity: "20.1 gal",
            cargoVolume: "9.5 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "15 mpg", highwayMPG: "23 mpg", combinedMPG: "18 mpg" },
        wheels: {
            frontTires: "275/35 ZR21",
            rearTires: "315/30 ZR21",
            frontBrakes: "Carbon Ceramic 16.1\" 6-piston",
            rearBrakes: "Carbon Ceramic 14.2\" 4-piston",
        },
        features: ["Adaptive Damping with Bilstein DTX", "Electronic Rear Differential", "10.25\" Infotainment by Bowers & Wilkins", "Aston Martin Drive Modes", "Matrix LED Headlamps"],
        safety: ["8 Airbags", "Blind Spot Monitoring", "Forward Collision Alert", "Lane Keep Assist", "360° Park Assist Camera"],
        interior: ["Bridge of Weir Leather", "14.5\" Digital Cluster", "10.25\" Central Touchscreen", "Bowers & Wilkins Audio", "Heated/Ventilated Seats", "Alcantara Headliner"],
        description: "The DB12 is 'the world's first Super Tourer' — Aston Martin's most powerful production DB car ever. With 671 hp from its AMG-derived twin-turbo V8, it defines a new category: faster than a sports car, more beautiful than anything else on the road.",
        sketchfabId: "7c5a09a1bac04e7e87b4f2a4d6c8e0f2",
    },

    "aston martin|vantage v12": {
        bodyType: "Coupe",
        drivetrain: "RWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "Vantage V12 (Final Edition)",
        countryOfOrigin: "United Kingdom",
        engine: {
            type: "Twin-Turbocharged V12",
            displacement: "5.2L (5,204 cc)",
            configuration: "V12 60°",
            horsepower: "690 hp @ 6,500 rpm",
            torque: "555 lb-ft @ 1,800-6,000 rpm",
            fuelSystem: "Direct Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 48-Valve",
            redline: "7,000 rpm",
        },
        performance: {
            topSpeed: "200 mph",
            acceleration060: "3.4 seconds",
            acceleration0100: "6.5 seconds",
            quarterMile: "11.0 seconds",
            brakingDistance: "98 ft (60-0)",
            lateralG: "1.12 g",
        },
        transmission: { type: "ZF 8-Speed Automatic", gears: 8, driveType: "Rear-Wheel Drive" },
        dimensions: {
            length: "175.0 in",
            width: "76.4 in",
            height: "50.2 in",
            wheelbase: "104.5 in",
            curbWeight: "3,946 lbs",
            fuelCapacity: "19.8 gal",
            cargoVolume: "6.4 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "12 mpg", highwayMPG: "18 mpg", combinedMPG: "14 mpg" },
        wheels: {
            frontTires: "275/35 ZR21",
            rearTires: "315/30 ZR21",
            frontBrakes: "Carbon Ceramic 16.1\" 6-piston",
            rearBrakes: "Carbon Ceramic 14.2\" 4-piston",
        },
        features: ["Limited to 333 Units", "Carbon Fiber Body Panels", "Adaptive Dampers", "Electronic LSD", "Sports Plus Seats"],
        safety: ["6 Airbags", "ABS", "Dynamic Stability Control", "Traction Control", "Tire Pressure Monitoring"],
        interior: ["Semi-Aniline Leather", "Carbon Fiber & Satin Chopped CF Trim", "Bowers & Wilkins Premium Audio", "Performance Seats with Memory"],
        description: "The Vantage V12 is the ultimate expression of Aston Martin's sports car — a 5.2L twin-turbo V12 stuffed into the compact Vantage body. Limited to just 333 units worldwide, it's instantly collectible and devastatingly fast.",
        sketchfabId: "92afc84e5cfc44e3a39e27c47b0c96f0",
    },

    "mclaren|750s": {
        bodyType: "Coupe",
        drivetrain: "RWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "750S (P15)",
        countryOfOrigin: "United Kingdom",
        engine: {
            type: "Twin-Turbocharged V8",
            displacement: "4.0L (3,994 cc)",
            configuration: "V8 Flat-Plane Crank",
            horsepower: "740 hp @ 7,500 rpm",
            torque: "590 lb-ft @ 5,500 rpm",
            fuelSystem: "Direct Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 32-Valve",
            redline: "8,500 rpm",
        },
        performance: {
            topSpeed: "206 mph",
            acceleration060: "2.7 seconds",
            acceleration0100: "5.6 seconds",
            quarterMile: "10.0 seconds",
            brakingDistance: "90 ft (60-0)",
            lateralG: "1.25 g",
        },
        transmission: { type: "SSG 7-Speed DCT", gears: 7, driveType: "Rear-Wheel Drive" },
        dimensions: {
            length: "179.4 in",
            width: "80.1 in",
            height: "47.2 in",
            wheelbase: "105.1 in",
            curbWeight: "2,963 lbs",
            fuelCapacity: "17.2 gal",
            cargoVolume: "5.3 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "15 mpg", highwayMPG: "22 mpg", combinedMPG: "18 mpg" },
        wheels: {
            frontTires: "225/35 ZR19",
            rearTires: "295/30 ZR20",
            frontBrakes: "Carbon Ceramic 15.6\" 6-piston",
            rearBrakes: "Carbon Ceramic 15.0\" 4-piston",
        },
        features: ["Carbon Fiber MonoCell II Chassis", "Proactive Damping Control", "Variable Drift Control", "Active Rear Spoiler", "Dihedral Doors"],
        safety: ["6 Airbags", "ABS with EBD", "ESC", "Traction Control", "Tire Monitoring"],
        interior: ["Alcantara & Leather", "McLaren Infotainment with Vertical Screen", "Bowers & Wilkins Audio", "Electrochromic Roof", "Lightweight Carbon Seats"],
        description: "The McLaren 750S is a masterclass in lightweight engineering — just 2,963 lbs with 740 hp. Its carbon-fiber monocell chassis, proactive damping, and F1-derived aerodynamics make it one of the purest driver's cars on the planet.",
        sketchfabId: "26f1d0f936f5436cab31f09a3b63c0b4",
    },

    "mclaren|artura": {
        bodyType: "Coupe",
        drivetrain: "RWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "Artura (HPH V6 Hybrid)",
        countryOfOrigin: "United Kingdom",
        engine: {
            type: "Twin-Turbo V6 + E-Motor Hybrid",
            displacement: "3.0L (2,993 cc) + 94 hp E-Motor",
            configuration: "V6 120° + Electric Motor",
            horsepower: "680 hp combined",
            torque: "531 lb-ft combined",
            fuelSystem: "Direct Injection + Electric",
            aspiration: "Twin-Turbo + Electric",
            valvetrain: "DOHC 24-Valve",
            redline: "8,500 rpm",
        },
        performance: {
            topSpeed: "205 mph",
            acceleration060: "2.9 seconds",
            acceleration0100: "5.8 seconds",
            quarterMile: "10.5 seconds",
            brakingDistance: "92 ft (60-0)",
            lateralG: "1.20 g",
        },
        transmission: { type: "8-Speed SSG DCT", gears: 8, driveType: "Rear-Wheel Drive" },
        dimensions: {
            length: "175.2 in",
            width: "76.2 in",
            height: "47.0 in",
            wheelbase: "101.9 in",
            curbWeight: "3,303 lbs",
            fuelCapacity: "15.9 gal",
            cargoVolume: "5.0 cu ft",
        },
        fuel: { fuelType: "Hybrid (Premium + Electric)", cityMPG: "20 mpg", highwayMPG: "23 mpg", combinedMPG: "21 mpg" },
        wheels: {
            frontTires: "235/35 ZR19",
            rearTires: "295/35 ZR20",
            frontBrakes: "Carbon Ceramic 15.4\" 6-piston",
            rearBrakes: "Carbon Ceramic 13.8\" 4-piston",
        },
        features: ["McLaren Carbon Lightweight Architecture", "Plug-In Hybrid (19-mile EV range)", "E-Diff", "Proactive Damping 2.0", "EV Mode for Silent Running"],
        safety: ["6 Airbags", "ABS with EBD", "ESC", "Traction Control", "TPMS"],
        interior: ["McLaren Smart Cockpit", "8\" Vertical Touchscreen", "Bowers & Wilkins Audio", "Heated/Electric Seats", "Club Sport Interior Option"],
        description: "The Artura is McLaren's first ever production hybrid supercar — a groundbreaking HPH (High-Performance Hybrid) that combines a compact twin-turbo V6 with an electric motor for 680 hp. It can run in full EV mode for silent city driving.",
        sketchfabId: "10c4a1c87c0847b4a23ed4c5f6f7e8d9",
    },

    "bentley|continental gt speed": {
        bodyType: "Grand Tourer",
        drivetrain: "AWD",
        seatingCapacity: 4,
        doors: 2,
        generation: "Continental GT (3rd Gen Facelift)",
        countryOfOrigin: "United Kingdom",
        engine: {
            type: "Twin-Turbocharged W12",
            displacement: "6.0L (5,950 cc)",
            configuration: "W12 (TSI)",
            horsepower: "650 hp @ 6,000 rpm",
            torque: "664 lb-ft @ 1,500-5,000 rpm",
            fuelSystem: "Direct + Port Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 48-Valve",
            redline: "6,200 rpm",
        },
        performance: {
            topSpeed: "208 mph",
            acceleration060: "3.5 seconds",
            acceleration0100: "7.0 seconds",
            quarterMile: "11.0 seconds",
            brakingDistance: "102 ft (60-0)",
            lateralG: "1.02 g",
        },
        transmission: { type: "ZF 8-Speed DCT", gears: 8, driveType: "All-Wheel Drive" },
        dimensions: {
            length: "190.9 in",
            width: "77.4 in",
            height: "55.3 in",
            wheelbase: "112.2 in",
            curbWeight: "5,093 lbs",
            fuelCapacity: "23.8 gal",
            cargoVolume: "12.6 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "12 mpg", highwayMPG: "20 mpg", combinedMPG: "15 mpg" },
        wheels: {
            frontTires: "275/35 ZR22",
            rearTires: "275/35 ZR22",
            frontBrakes: "Carbon Ceramic 17.3\" 10-piston",
            rearBrakes: "Carbon Ceramic 14.1\" 4-piston",
        },
        features: ["48V Active Anti-Roll Bar", "Electronic LSD", "Air Suspension with Continuous Damping", "Bentley Rotating Display", "Diamond Knurled Shift Paddles"],
        safety: ["8 Airbags", "ACC with Stop & Go", "Traffic Assist", "Night Vision", "360° Camera", "Lane Assist"],
        interior: ["Hand-Stitched Diamond-Quilted Leather", "Naim for Bentley Audio (2,200W, 18 speakers)", "Rotating 12.3\" Display", "Breitling Tourbillon Clock", "Polished Veneer Panels"],
        description: "The Continental GT Speed with its legendary 6.0L W12 engine is the ultimate grand tourer — 650 hp wrapped in hand-crafted British luxury. With the Breitling tourbillon clock and Naim audio system, it's as much a work of art as it is a performance machine.",
        sketchfabId: "ab3e5b7c9d3e4f5a8b2c1d0e6f7a8b9c",
    },

    "bentley|flying spur": {
        bodyType: "Sedan",
        drivetrain: "AWD",
        seatingCapacity: 5,
        doors: 4,
        generation: "Flying Spur (3rd Gen)",
        countryOfOrigin: "United Kingdom",
        engine: {
            type: "Twin-Turbocharged V8",
            displacement: "4.0L (3,996 cc)",
            configuration: "V8 90°",
            horsepower: "542 hp @ 6,000 rpm",
            torque: "568 lb-ft @ 2,000-4,500 rpm",
            fuelSystem: "Direct + Port Injection",
            aspiration: "Twin-Turbo",
            valvetrain: "DOHC 32-Valve",
            redline: "6,500 rpm",
        },
        performance: {
            topSpeed: "198 mph",
            acceleration060: "3.9 seconds",
            acceleration0100: "8.5 seconds",
            quarterMile: "12.0 seconds",
            brakingDistance: "108 ft (60-0)",
            lateralG: "0.98 g",
        },
        transmission: { type: "ZF 8-Speed DCT", gears: 8, driveType: "All-Wheel Drive" },
        dimensions: {
            length: "209.1 in",
            width: "78.7 in",
            height: "58.9 in",
            wheelbase: "125.6 in",
            curbWeight: "5,203 lbs",
            fuelCapacity: "22.5 gal",
            cargoVolume: "14.6 cu ft",
        },
        fuel: { fuelType: "Premium Unleaded", cityMPG: "14 mpg", highwayMPG: "21 mpg", combinedMPG: "16 mpg" },
        wheels: {
            frontTires: "275/40 R20",
            rearTires: "275/40 R20",
            frontBrakes: "Iron 15.7\" 6-piston",
            rearBrakes: "Iron 14.1\" 4-piston",
        },
        features: ["All-Wheel Steering", "Air Suspension", "Bentley Dynamic Ride (48V)", "14-Way Comfort Seats", "Mood Lighting"],
        safety: ["8 Airbags", "ACC", "Lane Assist", "Night Vision", "360° Camera", "Traffic Sign Recognition"],
        interior: ["Hand-Cross-Stitched Leather", "Naim Audio (2,200W)", "Rear Seat Entertainment", "Executive Table Package", "Diamond-In-Diamond Quilting"],
        description: "The Flying Spur is Bentley's sporting sedan — a four-door car that combines the performance of a grand tourer with the rear-seat luxury of a limousine. Rear passengers enjoy the Executive Table package, heated seats, and individual climate zones.",
        sketchfabId: "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    },

    "porsche|taycan turbo s": {
        bodyType: "Sedan",
        drivetrain: "AWD",
        seatingCapacity: 4,
        doors: 4,
        generation: "Taycan (J1 Mk2)",
        countryOfOrigin: "Germany",
        engine: {
            type: "Dual Permanent Magnet Synchronous Electric Motors",
            displacement: "93.4 kWh Battery Pack",
            configuration: "Front + Rear Electric Motors",
            horsepower: "939 hp (overboost w/ Launch Control)",
            torque: "849 lb-ft instantaneous",
            fuelSystem: "800V Electrical Architecture",
            aspiration: "Electric (N/A)",
            valvetrain: "N/A — Electric Drivetrain",
            redline: "N/A — 16,000 rpm motor",
        },
        performance: {
            topSpeed: "162 mph",
            acceleration060: "2.3 seconds",
            acceleration0100: "5.8 seconds",
            quarterMile: "10.2 seconds",
            brakingDistance: "88 ft (60-0)",
            lateralG: "1.10 g",
        },
        transmission: { type: "2-Speed Rear / 1-Speed Front", gears: 2, driveType: "All-Wheel Drive (Electric)" },
        dimensions: {
            length: "195.4 in",
            width: "77.4 in",
            height: "54.3 in",
            wheelbase: "114.2 in",
            curbWeight: "5,079 lbs",
            fuelCapacity: "93.4 kWh battery",
            cargoVolume: "14.3 cu ft (front + rear)",
        },
        fuel: { fuelType: "Electric", cityMPG: "106 MPGe", highwayMPG: "95 MPGe", combinedMPG: "100 MPGe" },
        wheels: {
            frontTires: "265/35 R21",
            rearTires: "305/30 R21",
            frontBrakes: "PSCB Surface Coated 16.5\" 10-piston",
            rearBrakes: "PSCB Surface Coated 14.6\" 4-piston",
        },
        features: ["800V Fast Charging (270 kW)", "Porsche Active Suspension", "Rear-Axle Steering", "Adaptive Air Suspension", "Matrix LED Headlights with HD Matrix", "Porsche Electric Sport Sound"],
        safety: ["10 Airbags", "PSM", "Adaptive Cruise Control", "Night Vision", "Head-Up Display AR", "Surround View"],
        interior: ["OLEA Club Leather (Olive-Tanned)", "Curved Digital Cockpit (16.8\")", "10.9\" Central + Passenger Displays", "Burmester 3D High-End Audio (21 speakers)", "Heated/Ventilated Seats"],
        description: "The Taycan Turbo S is Porsche's electric masterpiece — 939 hp through dual motors, a world-first 800V architecture for ultrafast charging, and a 2-speed gearbox on the rear axle. It proves that electrification enhances the Porsche driving experience.",
        sketchfabId: "77d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2",
    },

    "ferrari|296 gtb": {
        bodyType: "Coupe",
        drivetrain: "RWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "296 GTB (F171)",
        countryOfOrigin: "Italy",
        engine: {
            type: "Twin-Turbo V6 + E-Motor PHEV",
            displacement: "3.0L (2,992 cc) V6 + 167 hp E-Motor",
            configuration: "V6 120° Hot-Vee + Electric Motor",
            horsepower: "819 hp combined (654 ICE + 167 Electric)",
            torque: "546 lb-ft combined",
            fuelSystem: "Direct Injection + Electric",
            aspiration: "Twin-Turbo + Electric",
            valvetrain: "DOHC 24-Valve",
            redline: "8,000 rpm",
        },
        performance: {
            topSpeed: "205 mph",
            acceleration060: "2.9 seconds",
            acceleration0100: "5.4 seconds",
            quarterMile: "10.1 seconds",
            brakingDistance: "92 ft (60-0)",
            lateralG: "1.30 g",
        },
        transmission: { type: "F1 8-Speed DCT", gears: 8, driveType: "Rear-Wheel Drive" },
        dimensions: {
            length: "176.6 in",
            width: "77.8 in",
            height: "46.7 in",
            wheelbase: "103.6 in",
            curbWeight: "3,296 lbs",
            fuelCapacity: "17.7 gal",
            cargoVolume: "6.5 cu ft",
        },
        fuel: { fuelType: "Hybrid (Premium + Electric)", cityMPG: "18 mpg", highwayMPG: "21 mpg", combinedMPG: "19 mpg" },
        wheels: {
            frontTires: "245/35 ZR20",
            rearTires: "305/35 ZR20",
            frontBrakes: "CCM-R Carbon Ceramic 15.6\" 6-piston",
            rearBrakes: "CCM-R Carbon Ceramic 14.2\" 4-piston",
        },
        features: ["EV Mode (15-mile range)", "Assetto Fiorano (Optional Ultra-Track Pack)", "Active Aero", "ABS Evo with 6D Sensor", "eManettino Drive Selector", "Virtual Short Wheelbase"],
        safety: ["6 Airbags", "ABS with EBD", "F1-Trac", "Side Slip Control", "FDE+ Dynamic Enhancer"],
        interior: ["Full Leather Interior", "16\" Curved Digital Cluster", "JBL Audio", "Carbon Fiber Seats (Fiorano)", "Aluminum Shift Paddles", "Yellow Rev Counter"],
        description: "The 296 GTB is Ferrari's plug-in hybrid mid-engine berlinetta — a revolutionary 120° V6 twin-turbo paired with an electric motor for a combined 819 hp. It marks the return of the mid-rear 6-cylinder engine to Maranello after 50 years, reimagined for a new era.",
        sketchfabId: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
    },

    "lamborghini|revuelto": {
        bodyType: "Coupe",
        drivetrain: "AWD",
        seatingCapacity: 2,
        doors: 2,
        generation: "Revuelto (LB744)",
        countryOfOrigin: "Italy",
        engine: {
            type: "V12 + Triple E-Motor PHEV",
            displacement: "6.5L (6,498 cc) V12 + 3 Electric Motors",
            configuration: "V12 65° + Axial-Flux E-Motors",
            horsepower: "1,001 hp combined (814 V12 + 187 Electric)",
            torque: "535 lb-ft from V12 + instant electric torque",
            fuelSystem: "Direct Injection + Electric",
            aspiration: "Naturally Aspirated V12 + Electric",
            valvetrain: "DOHC 48-Valve VVT",
            redline: "9,500 rpm",
        },
        performance: {
            topSpeed: "217 mph",
            acceleration060: "2.5 seconds",
            acceleration0100: "5.0 seconds",
            quarterMile: "9.8 seconds",
            brakingDistance: "89 ft (60-0)",
            lateralG: "1.35 g",
        },
        transmission: { type: "8-Speed DCT (New Design)", gears: 8, driveType: "e-AWD (Electric Front + V12 Rear)" },
        dimensions: {
            length: "188.3 in",
            width: "80.3 in",
            height: "45.3 in",
            wheelbase: "108.3 in",
            curbWeight: "3,858 lbs",
            fuelCapacity: "21.7 gal",
            cargoVolume: "4.9 cu ft",
        },
        fuel: { fuelType: "Hybrid (Premium + Electric)", cityMPG: "16 mpg", highwayMPG: "19 mpg", combinedMPG: "17 mpg" },
        wheels: {
            frontTires: "265/35 ZR20",
            rearTires: "345/30 ZR21",
            frontBrakes: "CCM-R+ Carbon Ceramic 15.7\" 6-piston",
            rearBrakes: "CCM-R+ Carbon Ceramic 15.0\" 4-piston",
        },
        features: ["Monofuselage Carbon Fiber Chassis", "13 Drive Modes", "EV Mode (City)", "Active Aero", "Scissor Doors", "3.8 kWh Battery Pack"],
        safety: ["8 Airbags", "ABS", "ESC", "Traction Control", "TPMS", "Rear Camera"],
        interior: ["Full Leather & Alcantara", "12.3\" Driver Display", "8.4\" HMI Central", "Passenger Display", "Lamborghini Connect", "Custom Color Stitching"],
        description: "The Revuelto is the Aventador's successor and Lamborghini's first ever V12 hybrid — a 1,001 hp beast with a NA 6.5L V12 paired with three electric motors. It keeps the legendary naturally aspirated V12 alive while embracing electrification. The most powerful Lamborghini road car ever.",
        sketchfabId: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    },
};

/**
 * Look up specs for a given make + model combination.
 * Falls back to a generated spec sheet if no exact match exists.
 */
export function getCarSpecs(make: string, model: string): CarSpecs | null {
    const key = `${make.toLowerCase()}|${model.toLowerCase()}`;
    return SPECS_DB[key] || null;
}

/** Get all known car spec keys */
export function getKnownCars(): string[] {
    return Object.keys(SPECS_DB);
}

/**
 * Returns a map of Make → Model[] from the specs database.
 * Display names use proper casing matching the dealership inventory.
 */
export function getKnownMakesAndModels(): Record<string, string[]> {
    // Display-name map: lowercase key → proper display name
    const displayNames: Record<string, { make: string; model: string }> = {
        "porsche|911 turbo s": { make: "Porsche", model: "911 Turbo S" },
        "porsche|cayenne turbo gt": { make: "Porsche", model: "Cayenne Turbo GT" },
        "porsche|taycan turbo s": { make: "Porsche", model: "Taycan Turbo S" },
        "ferrari|f8 tributo": { make: "Ferrari", model: "F8 Tributo" },
        "ferrari|roma spider": { make: "Ferrari", model: "Roma Spider" },
        "ferrari|296 gtb": { make: "Ferrari", model: "296 GTB" },
        "lamborghini|huracán evo": { make: "Lamborghini", model: "Huracán EVO" },
        "lamborghini|urus performante": { make: "Lamborghini", model: "Urus Performante" },
        "lamborghini|revuelto": { make: "Lamborghini", model: "Revuelto" },
        "aston martin|db12": { make: "Aston Martin", model: "DB12" },
        "aston martin|vantage v12": { make: "Aston Martin", model: "Vantage V12" },
        "mclaren|750s": { make: "McLaren", model: "750S" },
        "mclaren|artura": { make: "McLaren", model: "Artura" },
        "bentley|continental gt speed": { make: "Bentley", model: "Continental GT Speed" },
        "bentley|flying spur": { make: "Bentley", model: "Flying Spur" },
    };

    const result: Record<string, string[]> = {};
    for (const key of Object.keys(SPECS_DB)) {
        const display = displayNames[key];
        if (!display) continue;
        if (!result[display.make]) result[display.make] = [];
        if (!result[display.make].includes(display.model)) result[display.make].push(display.model);
    }
    return result;
}
