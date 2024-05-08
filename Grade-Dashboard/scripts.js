// Graphs functionality

let students = [];
let lineChart, pieChart, columnChart;
const primaryColors = ['#6CE5E8', '#41B8D5', '#2D8BBA', '#04BADE']; 

function addStudentGrades() {
    const name = document.getElementById('studentName').value.trim();
    const grades = {
        Module: parseFloat(document.getElementById('moduleGrade').value),
        Video: parseFloat(document.getElementById('videoGrade').value),
        TextChat: parseFloat(document.getElementById('textChatGrade').value),
        Meeting: parseFloat(document.getElementById('meetingGrade').value)
    };

    if (name && Object.values(grades).every(g => !isNaN(g))) {
        students.push({ name, grades });
        updateCharts();
        updateResults();
        clearInputs();
    } else {
        alert('Please enter valid names and grades for all categories.');
    }
}

function updateCharts() {
    const categories = ['Module', 'Video', 'TextChat', 'Meeting'];
    updateLineChart(categories);
    updatePieChart(categories);
    updateColumnChart(categories);
}

function updateResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<h2>Overall Results</h2>';
    students.forEach(student => {
        const average = calculateAverage(Object.values(student.grades));
        const bestCategory = getBestCategory(student.grades);
        const studentResult = document.createElement('p');
        studentResult.innerHTML = `<strong>${student.name}</strong>: Average Grade = ${average.toFixed(2)}, Best in = ${bestCategory}`;
        resultsContainer.appendChild(studentResult);
    });
}

function getBestCategory(grades) {
    return Object.keys(grades).reduce((best, category) => 
        grades[best] > grades[category] ? best : category
    );
}

function calculateAverage(grades) {
    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return total / grades.length;
}

function updateLineChart(categories) {
    const datasets = students.map((student, index) => ({
        label: student.name,
        data: categories.map(category => student.grades[category]),
        borderColor: primaryColors[index % primaryColors.length],
        backgroundColor: primaryColors[index % primaryColors.length],
        fill: false
    }));

    if (lineChart) {
        lineChart.data.labels = categories;
        lineChart.data.datasets = datasets;
        lineChart.update();
    } else {
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: { labels: categories, datasets },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }
}

function updatePieChart(categories) {
    const totalGrades = students.reduce((acc, student) => acc + Object.values(student.grades).reduce((sum, value) => sum + value, 0), 0);
    const totals = categories.map(category => 
        students.reduce((sum, student) => sum + student.grades[category], 0)
    );
    const percentages = totals.map(value => (value / totalGrades * 100).toFixed(2));

    if (pieChart) {
        pieChart.data.labels = categories;
        pieChart.data.datasets[0].data = percentages;
        pieChart.update();
    } else {
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: percentages,
                    backgroundColor: primaryColors,
                    hoverOffset: 4
                }]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let label = data.labels[tooltipItem.index] || '';
                            if (label) {
                                label += ': ';
                            }
                            label += `${data.datasets[0].data[tooltipItem.index]}%`;
                            return label;
                        }
                    }
                }
            }
        });
    }
}

function updateColumnChart(categories) {
    const datasets = students.map((student, index) => ({
        label: student.name,
        data: categories.map(category => student.grades[category]),
        backgroundColor: primaryColors[index % primaryColors.length],
    }));

    if (columnChart) {
        columnChart.data.labels = categories;
        columnChart.data.datasets = datasets;
        columnChart.update();
    } else {
        const columnCtx = document.getElementById('columnChart').getContext('2d');
        columnChart = new Chart(columnCtx, {
            type: 'bar',
            data: { labels: categories, datasets },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }
}

function clearInputs() {
    document.getElementById('studentName').value = '';
    document.getElementById('moduleGrade').value = '';
    document.getElementById('videoGrade').value = '';
    document.getElementById('textChatGrade').value = '';
    document.getElementById('meetingGrade').value = '';
}

// toaster

function addStudentGrades() {
    const name = document.getElementById('studentName').value.trim();
    const grades = {
        Module: parseFloat(document.getElementById('moduleGrade').value),
        Video: parseFloat(document.getElementById('videoGrade').value),
        TextChat: parseFloat(document.getElementById('textChatGrade').value),
        Meeting: parseFloat(document.getElementById('meetingGrade').value)
    };

    if (name && Object.values(grades).every(g => !isNaN(g) && g !== '')) {
        students.push({ name, grades });
        updateCharts();
        updateResults();
        clearInputs();
    } else {
        document.getElementById('toaster').style.display = 'block';
        setTimeout(() => {
            document.getElementById('toaster').style.display = 'none';
        }, 4000); // Hide the toaster after 4 seconds
        alert('Please enter valid names and grades for all categories.');
    }
}

// input fields

function showStudentToaster() {
    const studentName = document.getElementById('studentName').value;
    const toaster = document.getElementById('toaster');
    if (studentName === "") {
        toaster.textContent = "Please enter the student's name.";
        toaster.style.display = 'block';
        setTimeout(() => { toaster.style.display = 'none'; }, 3000);
    } else {
        toaster.textContent = `Student ${studentName} added.`;
        toaster.style.display = 'block';
        setTimeout(() => { toaster.style.display = 'none'; }, 3000);
    }
}

// grades

function showGradesToaster() {
    const grades = [
        document.getElementById('moduleGrade').value,
        document.getElementById('videoGrade').value,
        document.getElementById('textChatGrade').value,
        document.getElementById('meetingGrade').value
    ];
    const toaster = document.getElementById('toaster');
    if (grades.some(grade => grade === "")) {
        toaster.textContent = "Please enter all grades.";
        toaster.style.display = 'block';
        setTimeout(() => { toaster.style.display = 'none'; }, 3000);
    } else {
        toaster.textContent = "Grades added.";
        toaster.style.display = 'block';
        setTimeout(() => { toaster.style.display = 'none'; }, 3000);
    }
}

// export to excel

function exportToExcel() {
    const wb = XLSX.utils.book_new(); 
    const ws_name = "Student Grades";

    
    let data = [['Student Name', 'Module Grade', 'Video Grade', 'Text Chat Grade', 'Meeting Grade', 'Average Grade', 'Best Category']];
    students.forEach(student => {
        const grades = student.grades;
        const average = calculateAverage(Object.values(grades)).toFixed(2);
        const bestCategory = getBestCategory(grades);
        data.push([student.name, grades.Module, grades.Video, grades.TextChat, grades.Meeting, average, bestCategory]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data); 

    XLSX.utils.book_append_sheet(wb, ws, ws_name); 
    XLSX.writeFile(wb, "StudentGrades.xlsx"); 
}

