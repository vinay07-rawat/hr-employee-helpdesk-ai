const policies = require("../data/policies.json");

function searchPolicy(keyword) {
    const searchTerm = keyword.toLowerCase();

    const results = policies.filter((policy) => {
        const title = policy.title.toLowerCase();
        const content = policy.content.toLowerCase();
        const keywords = policy.keywords.map((item) => item.toLowerCase());

        return (
            title.includes(searchTerm) ||
            content.includes(searchTerm) ||
            keywords.some((item) => item.includes(searchTerm))
        );
    });

    return {
        success: true,
        results: results.slice(0, 2)
    };
}

module.exports = {
    searchPolicy
};