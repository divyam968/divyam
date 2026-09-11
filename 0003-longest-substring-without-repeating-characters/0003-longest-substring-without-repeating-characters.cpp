class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        set<char> st;
        int left = 0;
        int ans = 0;

        for (int right = 0; right < s.length(); right++) {

            // Agar character already present hai
            while (st.count(s[right])) {
                st.erase(s[left]);
                left++;
            }

            st.insert(s[right]);

            // Current window ki length
            ans = max(ans, right - left + 1);
        }

        return ans;
    }
};