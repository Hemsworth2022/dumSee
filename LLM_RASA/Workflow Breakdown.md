Here's a detailed textual description of the workflow for the integration of Rasa AI and LLM for the Customer Data Purge Verification System:

Workflow Breakdown
1. User Interaction
* Input: The user interacts with the chatbot via a web app, mobile app, or messaging platform (e.g., WhatsApp, Slack).
* Examples:
    * "Has my data been purged?"
    * "I want to know the status of my personal data."

2. Intent Recognition by Rasa AI
* Rasa processes the user query and identifies the intent:
    * Example Intents:
        * check_data_purge_status
        * provide_details (e.g., SSN, DOB)
* Rasa extracts relevant entities (like SSN and DOB) from the user's message.

3. Authentication and Authorization
* Rasa triggers a custom action to authenticate the user via a backend API:
    * Input: SSN, DOB
    * Backend Validation: Checks if the user has an active relationship with the bank.
* Outcomes:
    * Success: Proceed to check purge status.
    * Failure: Notify the user they are unauthorized.

4. Purge Status Check
* Rasa sends an API request to the bank's backend to retrieve purge status:
    * Scenario A: If data is already purged:
        * Notify the user immediately: "Your data has been purged."
    * Scenario B: If data is not purged:
        * Notify the user: "Your data has not been purged yet. A request will be sent to the back-office team."
        * Create a purge request for the back-office team.

5. Fallback Handling with LLM
* If the query is ambiguous or doesn't fit predefined intents, Rasa invokes the LLM:
    * Input: User's original query.
    * LLM Role: Generate a natural and context-sensitive response.
        * Example: "Data purging involves permanently deleting your personal data from our systems as per compliance regulations."

6. User Notification
* The chatbot sends a confirmation or follow-up message to the user:
    * "We have submitted your purge request to the back-office team."
    * "Your data purge status has been confirmed as completed."

Diagram Structure
You can use this structure to build a workflow diagram in tools like Lucidchart or Draw.io. Here's how it looks conceptually:

1. Start: User interacts with the chatbot.
    * Arrow to: Rasa AI (Intent Recognition)
2. Rasa AI:
    * Decision Node 1: Intent Recognized?
        * Yes → Authenticate User
        * No → Pass Query to LLM (Fallback)
3. Authenticate User:
    * Decision Node 2: Authentication Successful?
        * Yes → Purge Status Check
        * No → Notify User of Authorization Failure
4. Purge Status Check:
    * Decision Node 3: Data Purged?
        * Yes → Notify User (Data Purged)
        * No → Notify User & Create Purge Request
5. LLM Fallback (If Applicable):
    * Generate Contextual Response → Notify User
6. End: User receives confirmation or next steps.

Would you like assistance with tools for designing this visually or further clarification on any step?
