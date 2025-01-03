hey @frontend, 

as you may know, we should become stricter with respect to our code coverage. The goal is to reach 80% coverage. To get the most meaningful coverage possible for the ClientApp, we need to decide what coverage criteria to follow. 
Here are the criteria and why one may/not choose one or the other:

- Functional coverage: Ensures that the functions in your code behave as expected. It's good for verifying that your components are working properly at a high level.
- Branch coverage: Tests that every possible branch of a control structure (like if/else statements) is executed. This is particularly useful for covering conditional logic and ensuring that all decision points are tested.
- Line coverage: This measures how many lines of your code are executed during tests. While useful, it's not always the best indicator of test quality since it doesn’t guarantee that your logic is actually tested.

We can aim for 80% on functional and 60% on branch. Let me know what y'all think.