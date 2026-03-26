<div class="retro-content-page retro-level-page theme-level-3">
<div class="retro-content-shell">

    <div class="retro-content-header">
      <div class="retro-content-kicker">Level 6</div>
      <h1>Using Calendar Events</h1>
      <p class="retro-content-subtitle">How to create, view, and manage calendar events and bookings for mentoring sessions. Includes session statuses such as attended, cancelled, late notice cancellation, and mentee no-show.</p>
    </div>

    <div class="retro-stepper" data-stepper>

      <div class="retro-step-indicator">
        Step <span data-step-current>1</span> of <span data-step-total>9</span>
      </div>

      <div class="retro-step-stage">

        <section class="retro-panel retro-step-panel is-active" data-step-panel>
          <h2>Overview</h2>
          <p>
            <strong>Before</strong> adding events, it is helpful to know that the Salesforce calendar works a little differently from Google Calendar.
          </p>
          <p>
            Some parts may feel less familiar at first, but once you know where to click, it becomes much easier to use.
          </p>
          <p>For example:</p>
          <ul>
            <li>to move an event, you edit the event details rather than dragging and dropping it</li>
            <li>event status is shown using a small coloured square in the title, rather than changing the colour of the full event</li>
          </ul>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>How to Add a Calendar Event</h2>
          <p>
            Each hour in the calendar is split into two sections:
          </p>
          <ul>
            <li>click the top half if the session starts on the hour</li>
            <li>click the bottom half if the session starts at half past</li>
          </ul>

          <div class="retro-image-panel">
            <img
              src="../assets/images/using-calendar-events/split1.png"
              alt="Calendar hour split into top and bottom sections"
              class="retro-inline-image"
            >
          </div>

          <p>
            This will open a flow where you can enter the event details.
          </p>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>Event Details</h2>

          <h3>Event Name</h3>
          <p>
            This can be anything you choose.
          </p>
          <p>
            We recommend using the mentee’s full name so it is easy to find later.
          </p>

          <h3>Description</h3>
          <p>
            If you are using Google Meet, you can paste the meeting link here.
          </p>

          <div class="retro-copy-list">
            <div class="retro-copy-item">
              <div class="retro-copy-item__text">
                <strong>Google Meet new meeting URL:</strong> https://meet.new/
              </div>
              <button
                type="button"
                class="retro-copy-button"
                data-copy-text="https://meet.new/"
                data-copy-label="Google Meet URL"
              >
                Copy
              </button>
            </div>
          </div>

          <div class="retro-copy-feedback" data-copy-feedback aria-live="polite"></div>

          <h3>Type</h3>
          <p>
            You will see a list of event types.
          </p>
          <p>
            Click a tile to flip it and see the details on the back.
          </p>

          <div class="retro-flip-grid" data-retro-flip-grid>

            <div class="retro-flip-card" data-flip-card data-animation="a">
              <button
                type="button"
                class="retro-flip-card__button"
                data-flip-trigger
                aria-expanded="false"
              >
                <div class="retro-flip-card__inner">
                  <div class="retro-flip-card__face retro-flip-card__front">
                    <h4>Mentoring &amp; Other Paid Work</h4>
                  </div>

                  <div class="retro-flip-card__face retro-flip-card__back">
                    <ul>
                      <li><strong>MindJam Mentoring:</strong> Normal sessions at your hourly rate.</li>
                      <li><strong>Other Paid Work:</strong> Work that is not mentoring, paid at your hourly rate.</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

            <div class="retro-flip-card" data-flip-card data-animation="b">
              <button
                type="button"
                class="retro-flip-card__button"
                data-flip-trigger
                aria-expanded="false"
              >
                <div class="retro-flip-card__inner">
                  <div class="retro-flip-card__face retro-flip-card__front">
                    <h4>Group Sessions</h4>
                  </div>

                  <div class="retro-flip-card__face retro-flip-card__back">
                    <ul>
                      <li><strong>Adventure Guild:</strong> D&amp;D (Dungeons &amp; Dragons) sessions.</li>
                      <li><strong>Group Session:</strong> Standard group sessions.</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

            <div class="retro-flip-card" data-flip-card data-animation="c">
              <button
                type="button"
                class="retro-flip-card__button"
                data-flip-trigger
                aria-expanded="false"
              >
                <div class="retro-flip-card__inner">
                  <div class="retro-flip-card__face retro-flip-card__front">
                    <h4>Fixed Rate Meetings (£40)</h4>
                  </div>

                  <div class="retro-flip-card__face retro-flip-card__back">
                    <ul>
                      <li><strong>Meeting (Charged):</strong> Formal meetings you can charge for.</li>
                      <li><strong>Official Meeting:</strong> Meetings that can be charged.</li>
                      <li><strong>Report (charged):</strong> Formal reports that you can charge for.</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

            <div class="retro-flip-card" data-flip-card data-animation="a">
              <button
                type="button"
                class="retro-flip-card__button"
                data-flip-trigger
                aria-expanded="false"
              >
                <div class="retro-flip-card__inner">
                  <div class="retro-flip-card__face retro-flip-card__front">
                    <h4>Non-Chargeable / Internal</h4>
                  </div>

                  <div class="retro-flip-card__face retro-flip-card__back">
                    <ul>
                      <li><strong>Report:</strong> Reports that are not charged.</li>
                      <li><strong>Parent/Carer Meeting:</strong> Initial meetings (not charged).</li>
                      <li><strong>Personal Time:</strong> Used for blockers or reminders (not billed).</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

            <div class="retro-flip-card" data-flip-card data-animation="b">
              <button
                type="button"
                class="retro-flip-card__button"
                data-flip-trigger
                aria-expanded="false"
              >
                <div class="retro-flip-card__inner">
                  <div class="retro-flip-card__face retro-flip-card__front">
                    <h4>Types to Ignore</h4>
                  </div>

                  <div class="retro-flip-card__face retro-flip-card__back">
                    <ul>
                      <li><strong>BlockJam Counselling</strong></li>
                      <li><strong>Counselling</strong></li>
                      <li><strong>Training</strong> (May be removed)</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

          </div>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>Mentee Field</h2>
          <p>
            This field links the event to a specific mentee. When you click into the <strong>Mentee Field</strong> you will see a drop down of all your mentees. If your mentee does not appear click <strong>Enter</strong> on your keyboard. This will open a window with all your mentees.
          </p>
          <p>
            If the event is for a mentoring session or other work connected to a young person, make sure you select the correct mentee here.
          </p>
          <p>
            If no mentee is added, the system will not know who the event is for.
          </p>
          <p>
            If you are creating a <strong>Personal Time</strong> event or another event <strong>not</strong> linked to a young person, such as <strong>Other Paid Work</strong>,
            you do not need to add a mentee.
          </p>

          <h3>Session Group</h3>
          <p>
            If this is a group session, use the <strong>Session Group</strong> field instead of selecting an individual mentee. Only do this if it is a group session event.
          </p>

          <h3>Start Time and End Time</h3>
          <p>
            Enter the time the event starts and ends.
          </p>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>Repeat and Other Fields</h2>

          <h3>Repeat</h3>
          <p>
            If the session repeats, you can choose how often:
          </p>
          <ul>
            <li>weekly</li>
            <li>monthly</li>
            <li>yearly</li>
          </ul>
          <p>
            If needed, you can also add an end date for the series.
          </p>
          <p>
            For example, if a session will only run for a set number of weeks, you can set when it should stop.
          </p>

          <h3>Related To and System Information</h3>
          <p>
            You can ignore these fields.
          </p>
          <p>
            <strong>Please do not change them.</strong>
          </p>

          <p>
            Once everything is complete, click <strong>Save</strong>.
          </p>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>Important</h2>
          <p>
            When an event is created, the system also creates a <strong>Service Appointment</strong> in the background.
          </p>
          <p>
            This can take up to <strong>40 seconds</strong>.
          </p>
          <p>
            If you do not see the Service Appointment straight away, it is usually best to wait a moment and check again.
          </p>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>After the Event Has Been Created</h2>
          <p>
            When you click on a calendar event, you will see some useful links and options.
          </p>

          <h3>Service Appointment</h3>
          <p>Use this when you need to:</p>
          <ul>
            <li>complete the wrap up</li>
            <li>confirm attendance</li>
            <li>update the session status</li>
          </ul>

          <h3>Edit or More Details</h3>
          <p>Use this when you need to:</p>
          <ul>
            <li>change the time</li>
            <li>change the date</li>
            <li>update other event details</li>
            <li>delete the event</li>
          </ul>

          <p>
            If you need to move a session, open the event and edit the start or end date and time.
          </p>
          <p>
            If the change only applies once, choose <strong>this event</strong>.
          </p>
          <p>
            If the change applies to the full repeating series, choose <strong>the series</strong>.
          </p>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>Deleting an Event</h2>
          <p>
            To delete an event, open it and use the <strong>Delete Series</strong> option.
          </p>

          <div class="retro-image-panel">
            <img
              src="../assets/images/using-calendar-events/create-calendar-event.gif"
              alt="Deleting an event using the Delete Series option"
              class="retro-inline-image"
            >
          </div>

          <p>
            Despite the name, this does more than one thing.
          </p>
          <p>
            You will then be asked whether you want to delete:
          </p>
          <ul>
            <li>just this event</li>
            <li>or this event and the following series</li>
          </ul>
          <p>
            So even though the button says <strong>Delete Series</strong>, you can still choose to remove only one event.
          </p>
        </section>

        <section class="retro-panel retro-step-panel" data-step-panel>
          <h2>Understanding the Coloured Square</h2>
          <p>
            Each calendar event includes a small square in the title. This will automatically update based on the wrap up, or if the session is called.
          </p>
          <p>
            This shows the session’s current status.
          </p>

          <div class="retro-image-panel">
            <img
              src="../assets/images/using-calendar-events/open-existing-calendar-event.gif"
              alt="Small coloured square showing the session status"
              class="retro-inline-image retro-status-image"
            >
          </div>

          <p><strong>Key:</strong></p>
          <div class="retro-status-key">
            <div class="retro-status-key__item">
              <div class="retro-status-key__icon" aria-hidden="true">🆕</div>
              <div class="retro-status-key__content">
                <strong>Draft</strong>
                <p>A placeholder for a Parent/Carer meeting added by the assigning team.</p>
              </div>
            </div>

            <div class="retro-status-key__item">
              <div class="retro-status-key__icon" aria-hidden="true">⬜</div>
              <div class="retro-status-key__content">
                <strong>Scheduled</strong>
                <p>A future session that is confirmed but has not yet taken place.</p>
              </div>
            </div>

            <div class="retro-status-key__item">
              <div class="retro-status-key__icon" aria-hidden="true">✅</div>
              <div class="retro-status-key__content">
                <strong>Completed</strong>
                <p>A successful session where the mentee attended and the wrap-up is finished.</p>
              </div>
            </div>

            <div class="retro-status-key__item">
              <div class="retro-status-key__icon" aria-hidden="true">❌</div>
              <div class="retro-status-key__content">
                <strong>Cancelled</strong>
                <p>A session cancelled within the official policy. No charge to the parent/carer.</p>
              </div>
            </div>

            <div class="retro-status-key__item">
              <div class="retro-status-key__icon" aria-hidden="true">🆘</div>
              <div class="retro-status-key__content">
                <strong>Admin Required</strong>
                <p>A wrapped-up session that is missing funding contact details. The MindJam Finance Team will sort this for you.</p>
              </div>
            </div>

            <div class="retro-status-key__item">
              <div class="retro-status-key__icon" aria-hidden="true">🟧</div>
              <div class="retro-status-key__content">
                <strong>Late Notice Cancellation</strong>
                <p>A cancellation outside the official policy. The parent/carer will be charged.</p>
              </div>
            </div>

            <div class="retro-status-key__item">
              <div class="retro-status-key__icon" aria-hidden="true">🟨</div>
              <div class="retro-status-key__content">
                <strong>Did Not Attend</strong>
                <p>The mentee did not show up for the session. The parent/carer will be charged.</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <div class="retro-step-nav">
        <button type="button" class="retro-button retro-step-button" data-step-prev>
          Previous
        </button>

        <button type="button" class="retro-button retro-button-pulse retro-step-button" data-step-next>
          Next
        </button>
      </div>

    </div>

    <div class="retro-panel retro-video-panel">
      <h2 class="retro-video-title">Watch a short explanation below</h2>

      <div class="retro-video-embed">
        <iframe
          src="https://www.youtube-nocookie.com/embed/DrtSBTkWnXg?rel=0"
          title="Using Calendar Events video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </div>
    </div>

    <div
      class="retro-content-footer retro-section-nav"
    >
      <a
        class="retro-button retro-section-nav__link"
        href="../understanding-the-difference/"
      >
        Previous Page
      </a>

      <a
        class="retro-button retro-section-nav__link"
        href="../wrap-up-a-session/"
      >
        Next Section
      </a>
    </div>

  </div>

  <div id="retro-transition" class="retro-transition" aria-hidden="true">
    <div class="retro-transition__scanlines"></div>
    <div class="retro-transition__grid"></div>
    <div class="retro-transition__flash"></div>
    <div class="retro-transition__beam"></div>
    <div class="retro-transition__stars"></div>

    <div class="retro-transition__terminal">
      <div class="retro-transition__terminal-title">System Transfer</div>
      <div class="retro-transition__terminal-text">Loading Next Level...</div>
    </div>
  </div>


</div>