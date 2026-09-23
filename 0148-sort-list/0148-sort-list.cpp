class Solution {
public:
    ListNode* sortList(ListNode* head) {
        if (head == NULL || head->next == NULL)
            return head;

        // Find middle
        ListNode* slow = head;
        ListNode* fast = head->next;

        while (fast != NULL && fast->next != NULL) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // Split into two lists
        ListNode* mid = slow->next;
        slow->next = NULL;

        // Sort both halves
        ListNode* left = sortList(head);
        ListNode* right = sortList(mid);

        // Merge sorted lists
        return merge(left, right);
    }

    ListNode* merge(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;

        while (l1 != NULL && l2 != NULL) {
            if (l1->val <= l2->val) {
                curr->next = l1;
                l1 = l1->next;
            } else {
                curr->next = l2;
                l2 = l2->next;
            }

            curr = curr->next;
        }

        if (l1 != NULL)
            curr->next = l1;
        else
            curr->next = l2;

        return dummy.next;
    }
};