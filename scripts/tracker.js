let allIssues = [];
let currentStatus = 'all';

// format user name
const getName = (name) => {
    return name
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
};

// get date only
const getDate = (issue) => {
    return issue.updatedAt.split('T')[0];
};

// show modal
const displayIssueModal = async(issueId) => {
    const issueModal = document.querySelector('#issue-modal');

    const issueUrl = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`;
    const issueRes = await fetch(issueUrl);
    const issueD = await issueRes.json();
    const issueData = issueD.data;
    console.log(issueData);

    issueModal.innerHTML = `
        <dialog id="issueModal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <div class="issue-detaills space-y-6">
                    <div class="issue-open-close-container">
                        <h3 class="font-semibold text-[24px]">${issueData.title}</h3>
                        <div class="flex items-center gap-1 justify between">
                            <p class="${issueData.status === 'open' ? 'green-bg' : 'purple-bg'} text-white py-1 px-3 rounded-2xl">${issueData.status === 'open' ?  'Open' : 'Closed'}</p>
                            <p><p class="gray-dot"></p> Opened by ${getName(issueData.author) ? getName(issueData.author) : 'Not Applicable'}</p>
                            <p><p class="gray-dot"></p> ${getDate(issueData)}</p>
                        </div>
                    </div>
                
                    <p class="gray-color">${issueData.description}</p>

                    <div class="bug-help-enhance uppercase space-y-2">
                        ${renderLabels(issueData.labels)}
                    </div>

                    <div class="assigne-priority bg-[#F8FAFC] p-4 flex items-center justify-between mt-6">
                        <div class="assigne">
                            <p class="text-gray-color">Assignee:</p>
                            <p>${getName(issueData.assignee) ? getName(issueData.assignee) : 'Not applicable'}</p>
                        </div>
                        
                        <div class="priority">
                            <p>Priority:</p>
                            <p class="${getPriorityStyle(issueData.priority)} font-medium text-[12px] text-center max-w-[80px] rounded-2xl py-[6px] uppercase">${issueData.priority}</p>
                        </div>
                    </div>
                </div>

                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-primary">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    `;

    const issueDialog = document.querySelector('#issueModal');
    issueDialog.showModal();
};

// priority styles
const getPriorityStyle = (priority) => {
    const data = {
        low: 'gray-bg',
        medium: 'yellow-bg',
        high: 'red-bg'
    };

    const pData = data[priority.toLowerCase()];

    return pData;
};

// show active class in button
const activeButton = (trackerBtn) => {
    const trackerBtns = document.querySelectorAll('.issue-tracker-btn');

    trackerBtns.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add(
            'btn-neutral',
            'btn-outline',
            'border-[#E4E4E7]',
            'text-[#64748B]',
            'hover:bg-primary',
            'hover:text-white',
            'hover:border-0'
        );
    });

    trackerBtn.classList.remove(
        'btn-neutral',
        'btn-outline',
        'border-[#E4E4E7]',
        'text-[#64748B]',
        'hover:bg-primary',
        'hover:text-white',
        'hover:border-0'
    );
    trackerBtn.classList.add('btn-primary');
};

// update issue count
const updateIssueCount = (status) => {
    const issueNumber = document.querySelector('#issue-number');
    const openStatus = document.querySelector('#open');
    const closedStatus = document.querySelector('#closed');

    let filteredIssues;

    if (status === 'all') {
        filteredIssues = allIssues;
    } else {
        filteredIssues = allIssues.filter(issue  =>
            issue.status === status
        );
    }

    const total = filteredIssues.length;

    issueNumber.innerText = `${total} Issues`;
};

// render labels
const renderLabels = (labels) => {
    const labelStyles = {
        'bug': {
            classes: 'red-bg border border-[#EF4444] rounded-2xl md:py-1',
            icon: '<i class="fa-solid fa-bug"></i>'
        },
        'help wanted': {
            classes: 'yellow-bg border border-[#D97706] rounded-2xl md:py-1',
            icon: '<i class="fa-regular fa-life-ring"></i>'
        },
        'enhancement' : {
            classes: 'green-bg border border-[#00A96E] rounded-2xl md:py-1',
            icon: '<i class="fa-regular fa-lightbulb"></i>'
        },
        'documentation' : {
            classes: 'yellow-bg border border-[#D97706] rounded-2xl md:py-1',
            icon: '<i class="fa-regular fa-clipboard"></i>'
        },
        'good first issue' : {
            classes: 'gray-bg border border-[#9CA3AF] rounded-2xl md:py-1',
            icon: '<i class="fa-brands fa-goodreads"></i>'
        }
    };

    if (!labels || labels.length === 0) return '';
    
    const labelData = labels.map(label => {
        const style = labelStyles[label.toLowerCase()];

        if (!style) return '';

        const styleTag = `<p class="${style.classes}">${style.icon} ${label.toUpperCase()}</p>`;

        return styleTag;
    }).join('');

    return labelData;
}

// render issues
const renderIssues = (status) => {
    const issueBottomContainer = document.querySelector('#issue-bottom-container');

    issueBottomContainer.innerHTML = '';

    const filteredIssues = allIssues.filter(issue =>
        (status === 'all')
            ? true
            : issue.status === status 
    );
    console.log(filteredIssues);

    if (filteredIssues.length === 0) {
        issueBottomContainer.innerHTML = `<div class="no-issues p-6 text-center gray-color">
            <p>No issues available</p>
        </div>`;

        return;
    }

    filteredIssues.forEach(issue => {
        issueBottomContainer.innerHTML += `
            <div id="issue-card" class="card bg-base-100 shadow-lg border-t-4 ${issue.status === 'open' ? 'border-[#00A96E]' : 'border-[#A855F7]'}">
                <div class="card-body space-y-3">
                    <div class="issue-criteria flex items-center justify-between">
                        <figure>
                            <img src="assets/${issue.status === 'open' ? 'open-status.png' : 'closed-status.png' }" alt="${issue.status}">
                        </figure>

                        <p id="issue-frequency" class="${getPriorityStyle(issue.priority)} font-medium text-[12px] text-center max-w-[80px] rounded-2xl py-[6px] uppercase">
                            ${issue.priority}
                        </p>
                    </div>

                    <div class="issue-description">
                        <h3 onclick="displayIssueModal(${issue.id})" class="clickable-title font-semibold text-[14px]">${issue.title}</h3>
                    
                        <p class="gray-color text-[12px] pt-2">${issue.description}</p>
                    </div>

                    <div class="bug-help-enhance uppercase text-center space-y-2">
                        ${renderLabels(issue.labels)}
                    </div>
                </div>

                <div class="border-t border-[#E4E4E7]"></div>

                <div class="card-body gray-color text-[12px]">
                    <p>#${issue.id} by ${getName(issue.author)}</p>
                    <p>${getDate(issue)}</p>
                </div>
            </div>
        `;
    });
};

// load all issues
const loadAllIssue = async() => {
    const issueUrl = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
    const issueRes = await fetch(issueUrl);
    const issueData = await issueRes.json();

    allIssues = issueData.data;
};

// switch between tabs
const switchTab = () => {
    const trackerBtns = document.querySelectorAll('.issue-tracker-btn');
    // console.log(tabContainerBtn);

    const callTheBtn = (event) => {
        const button = event.currentTarget;

        activeButton(button);

        const status = button.dataset.id.replace('tab-', '');

        currentStatus = status;

        renderIssues(status);
        updateIssueCount(status);
    };

    trackerBtns.forEach(btn => {
        btn.addEventListener('click', callTheBtn);
    });

    // load all as default tab with active button
    const defaultTab = document.querySelector('.issue-tracker-btn[data-id="tab-all"]');

    activeButton(defaultTab);
    renderIssues('all');
    updateIssueCount('all');
};

// initialization
const init = async () => {
    await loadAllIssue();
    switchTab();
};

init();

// implement search
const searchInput = document.querySelector('#issue-search');
// console.log(searchInput);

const searchIssues = (searchText) => {
    const issueBottomContainer = document.querySelector('#issue-bottom-container');

    const filtered = allIssues.filter(issue => {
        const filteredStatus =
            currentStatus === 'all'
            ? true
            : issue.status === currentStatus;
            
        const filteredSearch =
            issue.title.toLowerCase().includes(searchText);

        return filteredStatus && filteredSearch;
    });

    issueBottomContainer.innerHTML = '';

    if (filtered.length === 0) {
        issueBottomContainer.innerHTML = `
            <div class="no-issues p-6 text-center gray-color">
                <p>No issues found</p>
            </div>
        `;

        return;
    }

    filtered.forEach(issue => {
        issueBottomContainer.innerHTML += `
            <div class="card bg-base-100 shadow-lg border-t-4 ${issue.status === 'open' ? 'border-[#00A96E]' : 'border-[#A855F7]'}">
                <div class="card-body space-y-3">

                    <div class="issue-criteria flex items-center justify-between">
                        <figure>
                            <img src="assets/${issue.status === 'open' ? 'open-status.png' : 'closed-status.png'}">
                        </figure>

                        <p class="${getPriorityStyle(issue.priority)} font-medium text-[12px] text-center max-w-[80px] rounded-2xl py-[6px] uppercase">
                            ${issue.priority}
                        </p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-[14px]">${issue.title}</h3>
                        <p class="gray-color text-[12px] pt-2">${issue.description}</p>
                    </div>

                    <div class="bug-help-enhance uppercase flex items-center gap-1 text-center">
                        ${renderLabels(issue.labels)}
                    </div>
                </div>

                <div class="border-t border-[#E4E4E7]"></div>

                <div class="card-body gray-color text-[12px]">
                    <p>#${issue.id} by ${getName(issue.author)}</p>
                    <p>${getDate(issue)}</p>
                </div>
            </div>
        `;
    });
};

searchInput.addEventListener('input', (event) => {
    const searchText = event.currentTarget.value.toLowerCase().trim();
    // console.log(searchText);

    searchIssues(searchText);
});