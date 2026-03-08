let allIssues = [];
let currentStatus = 'all';

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
        'help-wanted': {
            classes: 'yellow-bg border border-[#D97706] rounded-2xl md:py-1',
            icon: '<i class="fa-regular fa-life-ring"></i>'
        },
        'ehancement' : {
            classes: 'green-bg border border-[#00A96E] rounded-2xl md:py-1',
            icon: '<i class="fa-regular fa-star"></i>'
        }
    };
    
    const labelData = labels.map(label => {
        const style = labelStyles[label.toLowerCase()];

        if (!style) return;

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
        const updatedAt = (issue.updatedAt).split('T')[0];

        issueBottomContainer.innerHTML += `
            <div id="issue-card" class="card bg-base-100 shadow-lg border-t-4 ${issue.status === 'open' ? 'border-[#00A96E]' : 'border-[#A855F7]'}">
                <div class="card-body space-y-3">
                    <div class="issue-criteria flex items-center justify-between">
                        <figure>
                            <img src="assets/${issue.status === 'open' ? 'open-status.png' : 'closed-status.png' }" alt="${issue.status}">
                        </figure>

                        <p id="issue-frequency" class="red-bg font-medium text-[12px] text-center max-w-[80px] rounded-2xl py-[6px] uppercase">
                            ${issue.priority}
                        </p>
                    </div>

                    <div class="issue-description">
                        <h3 class="font-semibold text-[14px]">${issue.title}</h3>
                    
                        <p class="gray-color text-[12px] pt-2">${issue.description}</p>
                    </div>

                    <div class="bug-help-enhance uppercase flex items-center gap-1 text-center">
                        ${renderLabels(issue.labels)}
                    </div>
                </div>

                <div class="border-t border-[#E4E4E7]"></div>

                <div class="card-body gray-color text-[12px]">
                    <p>#${issue.id} by ${issue.author}</p>
                    <p>${updatedAt}</p>
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
};

document.addEventListener('DOMContentLoaded', () => {
    loadAllIssue().then(() => {
        const defaultTab = document.querySelector('.issue-tracker-btn[data-id="tab-all"]');

        activeButton(defaultTab);
        renderIssues('all');
        updateIssueCount('all');
    });

    switchTab();
});