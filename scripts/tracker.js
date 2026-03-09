let allIssues = [];
let currentStatus = 'all';

// load  spinner
const loadingSpinner = (isLoading) => {
    const spinnerContainer = document.querySelector('#loading-spinner');

    if (isLoading) {
        spinnerContainer.classList.remove('hidden');
        spinnerContainer.classList.add('flex');
    } else {
        spinnerContainer.classList.add('hidden');
        spinnerContainer.classList.remove('flex');
    }
};

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
    loadingSpinner(true);

    const issueUrl = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`;
    const issueRes = await fetch(issueUrl);
    const {data: issueData} = await issueRes.json();
    // console.log(issueData);

    loadingSpinner(false);

    const issueModal = document.querySelector('#modal-content');

    // remove max width class
    issueModal
        .querySelectorAll('.max-w-\\[120px\\]')
        .forEach(el => {
            el.classList.remove('max-w-[120px]');
        });

    issueModal.innerHTML = `
        <div class="issue-open-close-container">
            <h3 class="font-semibold text-[24px]">${issueData.title}</h3>
            <div class="flex items-center gap-1 justify-between">
                <p class="${issueData.status === 'open' ? 'green-bg' : 'purple-bg'} text-white py-1 px-3 rounded-2xl">${issueData.status === 'open' ?  'Open' : 'Closed'}</p>
                <p><p class="gray-dot"></p> Opened by ${getName(issueData.author) ? getName(issueData.author) : 'Not Applicable'}</p>
                <p><p class="gray-dot"></p> ${getDate(issueData)}</p>
            </div>
        </div>
                
        <p class="gray-color">${issueData.description}</p>

        <div class="bug-help-enhance uppercase flex gap-1 items-center">
            ${displayLabels(issueData.labels, true)}
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
    `;

    const issueDialog = document.querySelector('#issue-modal-dialog');

    issueDialog.classList.add('modal-open');

    issueDialog.querySelector('button').addEventListener('click', () => {
        issueDialog.classList.remove('modal-open');
    });
};

// priority styles
const getPriorityStyle = (priority) => ({
        low: 'gray-bg',
        medium: 'yellow-bg',
        high: 'red-bg'
    }[priority.toLowerCase()]);

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

// display labels
const displayLabels = (labels, isModal = false) => {
    const labelStyles = {
        bug:
            ['red-bg border-[#EF4444]', 'fa-bug'],
        'help wanted':
            ['yellow-bg border-[#D97706]', 'fa-life-ring'],
        enhancement:
            ['green-bg border-[#00A96E]', 'fa-lightbulb'],
        documentation:
            ['yellow-bg border-[#D97706]', 'fa-clipboard'],
        'good first issue':
            ['gray-bg border-[#9CA3AF]', 'fa-goodreads']
    };

    if (!labels || labels.length === 0) return '';
    
    return labels.map(label => {
        const style = labelStyles[label.toLowerCase()];

        if (!style) return '';

        const [classes, icon] = style;

        return `
            <p class="rounded-2xl py-2 ${isModal ? '' : 'md:max-w-[100px]'} ${classes}">
                <i class="fa-solid ${icon}"></i> ${label.toUpperCase()}
            </p>
        `;
    }).join('');
}

// display issue card
const displayIssueCard = (issue) => {
    return `
        <div id="issue-card" class="card bg-base-100 shadow-lg border-t-4 ${
            issue.status === 'open' ? 'border-[#00A96E]' : 'border-[#A855F7]'
        }">
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
                    <h3 data-id="${issue.id}" class="clickable-title font-semibold text-[14px]">${issue.title}</h3>
                
                    <p class="gray-color text-[12px] pt-2">${issue.description}</p>
                </div>

                <div class="bug-help-enhance uppercase text-center flex gap-1 md:text-[9px]">
                    ${displayLabels(issue.labels)}
                </div>
            </div>

            <div class="border-t border-[#E4E4E7]"></div>

            <div class="card-body gray-color text-[12px]">
                <p>#${issue.id} by ${getName(issue.author)}</p>
                <p>${getDate(issue)}</p>
            </div>
        </div>
    `;
};

// display issue list
const displayIssueList = (filteredIssues) => {
    const issueBottomContainer = document.querySelector('#issue-bottom-container');

    issueBottomContainer.innerHTML = '';

    // if (filteredIssues.length === 0) {
    //     issueBottomContainer.innerHTML = `
    //          <div class="no-issues p-6 text-center gray-color">
    //             <p>No issues available</p>
    //         </div>`;

    //     return;
    // }

    // filteredIssues.forEach(issue => {
    //     issueBottomContainer.innerHTML += displayIssueCard(issue);
    // });

    issueBottomContainer.innerHTML = filteredIssues.length
        ? filteredIssues.map(displayIssueCard).join('')
        : `
            <div class="no-issues p-6 text-center gray-color">
                <p>No issues available</p>
            </div>
        `;

    issueBottomContainer.querySelectorAll('.clickable-title').forEach(title => {
        title.addEventListener('click', () => {
            const issueId = title.dataset.id;
            displayIssueModal(issueId);
        });
    });
};

// display issues
const displayIssues = (status = 'all') => {
    const filteredIssues = allIssues.filter(issue =>
        (status === 'all')
            ? true
            : issue.status === status 
    );
    // console.log(filteredIssues);

    displayIssueList(filteredIssues);
};

// load all issues
const loadAllIssue = async() => {
    loadingSpinner(true);

    const issueUrl = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
    const issueRes = await fetch(issueUrl);
    const {data: issueData} = await issueRes.json();

    allIssues = issueData;

    loadingSpinner(false);
};

// switch between tabs
const switchTab = () => {
    const trackerBtns = document.querySelectorAll('.issue-tracker-btn');
    // console.log(tabContainerBtn);

    trackerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeButton(btn);

            currentStatus = btn.dataset.id.replace('tab-', '');

            displayIssues(currentStatus);
            updateIssueCount(currentStatus);
        });
    });

    // load all as default tab with active button
    const defaultTab = document.querySelector('.issue-tracker-btn[data-id="tab-all"]');

    activeButton(defaultTab);
    displayIssues('all');
    updateIssueCount('all');
};

// initialization
const init = async () => {
    await loadAllIssue();
    switchTab();
};

// implement search
// search issue using api
const searchIssues = async (searchText) => {
    // const filteredIssues = allIssues.filter(issue => {
    //     const filteredStatus =
    //         currentStatus === 'all'
    //         ? true
    //         : issue.status === currentStatus;
            
    //     const filteredSearch =
    //         issue.title.toLowerCase().includes(searchText);

    //     return filteredStatus && filteredSearch;
    // });

    if (!searchText) return displayIssues(currentStatus);

    loadingSpinner(true);

    const searchUrl = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;
    const searchRes = await fetch(searchUrl);
    const {data: searchData} = await searchRes.json();
    // console.log(searchData.data);

    loadingSpinner(false);

    displayIssueList(searchData);
};

document.querySelector('#issue-search').addEventListener('input', (event) => {
    searchIssues(
        event
            .currentTarget
            .value
            .toLowerCase()
            .trim()
    );
});

init();