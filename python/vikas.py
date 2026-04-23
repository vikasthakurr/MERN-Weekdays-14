print("hello")
print("welcome to python")
username="vikas"
password="12345"
print("username is:",username)

"""
---------------------------------------------------------
HOW PYTHON 'FOR' LOOPS WORK BEHIND THE SCENES
---------------------------------------------------------

When you use a `for` loop in Python (e.g., `for item in my_list:`), 
here is what actually happens under the hood:

1. Iterable to Iterator: 
   Python first calls the built-in `iter()` function on the object you are looping over (the iterable).
   This returns an "iterator" object, which keeps track of its internal state and knows how to fetch items one by one.

2. Fetching Items:
   Python then repeatedly calls the built-in `next()` function on that iterator object 
   to get the next item in the sequence.

3. Stopping the Loop:
   When there are no more items left to fetch, the iterator raises a special 
   built-in exception called `StopIteration`. 
   The `for` loop catches this exception internally and gracefully stops the loop.

--- Example Simulation ---
If you write a standard for loop like this:

my_list = [1, 2, 3]
for item in my_list:
    print(item)

Behind the scenes, Python essentially executes a `while` loop that looks like this:

my_list = [1, 2, 3]

# 1. Get the iterator
iterator = iter(my_list)

# 2. Infinite loop to fetch items
while True:
    try:
        # Get next item
        item = next(iterator)
        print(item)
    except StopIteration:
        # 3. Break the loop when no items are left
        break
"""