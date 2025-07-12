import './style.css'



let jobs = [];

const jobList = document.getElementById("job-list");
const template = document.getElementById("job-card-template");
const addBtn = document.getElementById("add-btn");
const applicationForm = document.getElementById("application-form");

// Temporary test data
jobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Meta',
    status: 'applied',
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'Netflix',
    status: 'interview',
  },
];


function renderJobs() {
  jobList.innerHTML = ''; // Clear the list

  jobs.forEach((job) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.job-title').textContent = job.title;
    clone.querySelector('.company-name').textContent = job.company;
    clone.querySelector('.job-status').textContent = `Status: ${job.status}`;

    // Add custom data for later use (e.g., editing/deleting)
    clone.querySelector('.job-card').dataset.id = job.id;

    jobList.appendChild(clone);
  });
}

renderJobs();

function addJob(title, company, status) {
  const job = {
    id: Date.now().toString(),
    title,
    company,
    status,
  };

  jobs.push(job);
  renderJobs();
}

addBtn.addEventListener("click", function() {
  applicationForm.classList.toggle('hide');
})