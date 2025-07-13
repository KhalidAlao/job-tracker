import './style.css'



let jobs = [];

const jobList = document.getElementById("job-list");
const template = document.getElementById("job-card-template");
const addBtn = document.getElementById("add-btn");
const applicationForm = document.getElementById("application-form");
const jobTitle = document.getElementById("job-title");
const companyName = document.getElementById("company-name");
const jobStatus = document.getElementById("job-status");
const dateAdded = document.getElementById("date-added");





// Temporary test data
jobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Meta',
    status: 'Applied',
    dateAdded: 'today',
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'Netflix',
    status: 'Interview',
    dateAdded: 'today',
  },
];



function renderJobs() {
  jobList.innerHTML = ''; // Clear the list

  jobs.forEach((job) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.job-id').textContent = job.id;
    clone.querySelector('.job-title').textContent = job.title;
    clone.querySelector('.company-name').textContent = job.company;
    clone.querySelector('.job-status').textContent = `Status: ${job.status}`;
    clone.querySelector('.date-added').textContent = `Date Added: ${job.dateAdded}`;

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
    dateAdded: new Date().toLocaleDateString(),
  };

  jobs.push(job);
  renderJobs();
}

addBtn.addEventListener("click", function() {
  applicationForm.classList.toggle('hide');
});

applicationForm.addEventListener("submit", function() {
event.preventDefault();

const title = jobTitle.value;
const company = companyName.value;
const status = jobStatus.value;

if (title.trim() === "" || company.trim() === "" || status === "all") {
  alert("Please fill in any empty fields!");

}

else {
  addJob(title, company, status);
}

});