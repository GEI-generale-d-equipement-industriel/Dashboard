import React from 'react'



function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return "Underweight (Maigreur)";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        return "Normal";
    } else if (bmi >= 25 && bmi <= 29.9) {
        return "Overweight (Surpoids)";
    } else if (bmi >= 30 && bmi <= 39.9) {
        return "Obesity (Obésité)";
    } else {
        return "Severe Obesity (Obésité massive)";
    }
}

export default function BmiIndicateur({bmi}) {
    const category = getBMICategory(bmi);

    const getIndicatorStyle = () => {
        if (bmi < 18.5) {
            return { backgroundColor: '#87CEEB' }; // Light blue for Underweight
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            return { backgroundColor: '#90EE90' }; // Light green for Normal
        } else if (bmi >= 25 && bmi <= 29.9) {
            return { backgroundColor: '#FFA500' }; // Orange for Overweight
        } else if (bmi >= 30 && bmi <= 39.9) {
            return { backgroundColor: '#FF4500' }; // Red for Obesity
        } else {
            return { backgroundColor: '#8B0000' }; // Dark red for Severe Obesity
        }
    };

    return (
        <div style={{
            width: '20%',
            padding: '10px',
            borderRadius: '5px',
            color: 'white',
            textAlign: 'center',
            ...getIndicatorStyle()
        }}>
            {category}
        </div>
    );
}
