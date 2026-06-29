export interface AlgorithmExplanation {
  pseudoExplanation: string[];
  java: string[];
  c: string[];
  python: string[];
}

const SHARED_SORT_PSEUDO = {
  bubble: [
    "Repeatedly walk through the array, comparing each pair of neighbours.",
    "If a pair is out of order, swap them immediately.",
    "After each full pass, the largest unsorted element 'bubbles' to its correct position at the end.",
    "Shrink the comparison range by one each pass since the tail is now sorted.",
    "Stop once a full pass makes zero swaps (already sorted) or all passes complete.",
  ],
};

export const EXPLANATIONS: Record<string, AlgorithmExplanation> = {
  "bubble-sort": {
    pseudoExplanation: SHARED_SORT_PSEUDO.bubble,
    java: [
      "Operates directly on the int[] reference, so swaps mutate the caller's array in place.",
      "Uses a plain int temp variable for the swap — no library helper needed.",
      "Outer loop runs n-1 times; inner loop bound shrinks as the tail becomes sorted.",
      "No early-exit flag here — every pass runs even if the array is already sorted.",
      "Time complexity stays O(n²) in the worst and average case; O(n) only with an added 'swapped' flag.",
    ],
    c: [
      "Takes a raw int* pointer plus an explicit length n, since C arrays don't know their own size.",
      "Swapping is done manually with a temp int — there's no built-in swap utility in C.",
      "Pointer arithmetic (arr[j], arr[j+1]) compiles down to simple memory offset access.",
      "No bounds checking exists in C, so passing the wrong n will silently read/write out of bounds.",
      "This is the canonical textbook version often used to teach nested loops in C courses.",
    ],
    python: [
      "Uses tuple-unpacking (arr[j], arr[j+1] = arr[j+1], arr[j]) to swap without a temp variable.",
      "Lists are mutable and passed by reference, so the function sorts in place like the Java/C versions.",
      "range(n - 1 - i) naturally shrinks the inner loop just like the C/Java version's loop bound.",
      "Python's dynamic typing means this same function works unmodified on floats or any comparable type.",
      "For real-world use, prefer arr.sort() or sorted() — both use the much faster Timsort algorithm.",
    ],
  },

  "selection-sort": {
    pseudoExplanation: [
      "Divide the array into a sorted region (front) and unsorted region (back).",
      "Scan the unsorted region to find the index of its minimum element.",
      "Swap that minimum into the front of the unsorted region, growing the sorted region by one.",
      "Repeat until the unsorted region has only one element left (it's already in place).",
      "Unlike bubble sort, this performs exactly n-1 swaps total, regardless of input order.",
    ],
    java: [
      "Tracks minIdx (an index) rather than the minimum value, so the swap can use array positions.",
      "Only one swap happens per outer-loop iteration — far fewer writes than bubble sort.",
      "The inner loop is a pure scan with no swapping, which keeps memory writes minimal.",
      "Useful in Java when swap operations are expensive (e.g. large objects instead of primitives).",
      "Still O(n²) comparisons even though writes are reduced to O(n).",
    ],
    c: [
      "Identical structure to Java — min_idx tracks the position, not the value, of the smallest element.",
      "Because writes are expensive on some embedded/flash memory, selection sort's O(n) swaps can beat bubble sort's O(n²) swaps in practice.",
      "No dynamic memory allocation is needed; everything operates on the existing array in place.",
      "The temp variable pattern for swapping is the standard idiom seen across nearly all C sorting code.",
      "Compilers can often auto-vectorize the inner min-finding loop since it has no data dependency between iterations.",
    ],
    python: [
      "The tuple swap (arr[i], arr[min_idx] = arr[min_idx], arr[i]) replaces the C/Java temp-variable dance.",
      "min_idx starts at i and only updates when a strictly smaller element is found, matching textbook selection sort.",
      "Could be rewritten using min() and list.index(), but the explicit loop matches the visualizer's step-by-step model.",
      "Selection sort is not stable in this form — equal elements can be reordered relative to each other.",
      "Still O(n²) time in Python, same as C/Java — language choice doesn't change algorithmic complexity.",
    ],
  },

  "insertion-sort": {
    pseudoExplanation: [
      "Treat the first element as a trivially sorted sublist of size one.",
      "Take the next element ('key') and shift all larger elements in the sorted part one slot right.",
      "Insert the key into the gap that opened up — now the sorted part is one element bigger.",
      "Repeat for every remaining element in the array.",
      "Performs very well on nearly-sorted data because shifts are minimal.",
    ],
    java: [
      "The 'key' variable holds the value being inserted while the while-loop shifts larger elements right.",
      "j ends one position before the key's correct slot, so arr[j+1] = key is always valid.",
      "No swapping here — just shifting and a single final assignment, which is more efficient than bubble sort's repeated swaps.",
      "Best case is O(n) when the array is already sorted, since the inner while-loop never executes.",
      "Java's Collections.sort() for small lists internally falls back to a similar insertion-based approach.",
    ],
    c: [
      "Structurally identical to the Java version — same key/shift/insert pattern.",
      "Because there's no swap, only assignment, this can be marginally faster than bubble sort in raw memory writes.",
      "Works equally well as an in-place algorithm requiring zero extra heap allocation.",
      "Commonly chosen for small embedded systems sorting tiny fixed-size arrays at runtime.",
      "Degrades to O(n²) on reverse-sorted input, same worst case as bubble and selection sort.",
    ],
    python: [
      "Mirrors the C/Java logic exactly — no Python-specific shortcuts taken here for clarity.",
      "This is the same strategy CPython's Timsort uses internally for runs shorter than 64 elements.",
      "key = arr[i] makes a copy of the value (ints are immutable), so shifting arr[j+1] = arr[j] is safe.",
      "j -= 1 decrements until the correct insertion point is found or the start of the array is reached.",
      "Real code should just use list.sort() — this manual version exists purely to visualize the algorithm.",
    ],
  },

  "merge-sort": {
    pseudoExplanation: [
      "If the array has 0 or 1 elements, it's already sorted — this is the recursion's base case.",
      "Otherwise, split the array into two halves around the midpoint.",
      "Recursively sort the left half and the right half independently.",
      "Merge the two sorted halves back together by repeatedly taking the smaller front element.",
      "This divide-and-conquer approach guarantees O(n log n) time in every case, unlike the simple sorts.",
    ],
    java: [
      "merge() allocates a temporary int[] array sized to the merge range, then copies the result back.",
      "Recursive calls split on mid = (l + r) / 2, dividing work in half at every level.",
      "Because a new array is created during merging, total extra space used is O(n), not O(1).",
      "The algorithm is stable: when arr[i] == arr[j], the left element is taken first, preserving original order.",
      "Arrays.sort() for Object[] in Java actually uses a variant of this exact algorithm (Timsort/mergesort hybrid).",
    ],
    c: [
      "Uses VLAs (variable-length arrays) L[n1] and R[n2] declared with sizes computed at runtime.",
      "Manually copies subranges into L and R before merging — no generic library container exists in C.",
      "VLAs live on the stack, so extremely large inputs could risk stack overflow; malloc is safer for production code.",
      "The three while-loops in merge() handle the 'left exhausted', 'right exhausted', and 'both still have elements' cases separately.",
      "C has no built-in stable sort in its standard library — qsort() does not guarantee stability.",
    ],
    python: [
      "Returns brand-new lists at every level instead of mutating in place, unlike the C/Java versions.",
      "Slicing (arr[:mid], arr[mid:]) is concise but creates a full copy each time, adding memory overhead.",
      "_merge() builds the result list with append() and finishes with leftover slices (left[i:] + right[j:]).",
      "Because Python lists hold references, sorting complex objects works without any extra changes.",
      "Python's built-in sorted()/list.sort() use Timsort, which borrows merge sort's divide-and-conquer idea but adds optimizations for real-world data.",
    ],
  },

  "quick-sort": {
    pseudoExplanation: [
      "Pick a pivot element — here, the last element of the current range.",
      "Partition the range so everything ≤ pivot ends up left of it, everything > pivot ends up right.",
      "After partitioning, the pivot sits in its final sorted position.",
      "Recursively quicksort the sub-range left of the pivot and the sub-range right of the pivot.",
      "Average case O(n log n); worst case O(n²) when pivots are consistently poor (e.g. already-sorted input with this pivot rule).",
    ],
    java: [
      "Uses the Lomuto partition scheme: a single index i tracks the boundary of the 'small' region as j scans forward.",
      "partition() returns the pivot's final index, which both recursive calls then use as their split point.",
      "Swapping is done with a manual temp variable, same idiom as the other sorts.",
      "Java's own Arrays.sort(int[]) uses a dual-pivot quicksort variant, which is faster in practice than this single-pivot version.",
      "Recursion depth can reach O(n) in the worst case (sorted input), risking a StackOverflowError on huge arrays.",
    ],
    c: [
      "partition() and quick_sort() are separated into two functions, matching the classic CLRS textbook structure.",
      "No extra array is allocated — quicksort partitions and swaps entirely in place, unlike merge sort.",
      "The C standard library's qsort() solves the same problem generically using function pointers for comparison.",
      "Choosing the last element as pivot makes already-sorted or reverse-sorted arrays trigger the O(n²) worst case.",
      "Randomizing the pivot (swap arr[high] with a random index first) is the standard fix for that worst case.",
    ],
    python: [
      "quick_sort(arr, low=0, high=None) uses a default argument trick so callers can just write quick_sort(arr).",
      "Like the C/Java versions, this sorts in place by mutating the list via index swaps — no new lists created.",
      "The tuple swap arr[i], arr[j] = arr[j], arr[i] replaces the explicit temp variable used in C/Java.",
      "Python's recursion limit (default 1000) can be hit on adversarial large inputs — sys.setrecursionlimit() can raise it.",
      "Python's built-in sort() is Timsort, not quicksort — this implementation is purely for learning the algorithm.",
    ],
  },

  "linear-search": {
    pseudoExplanation: [
      "Start at the first element of the array.",
      "Compare the current element to the target value.",
      "If it matches, return its index immediately — search is done.",
      "Otherwise, move to the next element and repeat.",
      "If the end of the array is reached with no match, return 'not found' (commonly -1).",
    ],
    java: [
      "A simple for-loop with an early return as soon as arr[i] == target is found.",
      "Returns -1 by convention when nothing matches, mirroring C's idiom (Java has no built-in 'not found' sentinel for primitives).",
      "Works on unsorted data — unlike binary search, no ordering assumption is required.",
      "Arrays.asList(arr).indexOf(target) gives similar behavior but only for Object[] arrays, not primitive int[].",
      "Time complexity is O(n) worst case — every element may need to be checked.",
    ],
    c: [
      "Takes the array length n explicitly since C pointers carry no size information.",
      "Returns -1 on failure, the standard 'sentinel value' convention used throughout C code.",
      "No built-in linear search exists in the C standard library — this manual loop is the idiomatic approach.",
      "Works identically on any data type by changing the array's element type and comparison.",
      "This is the algorithm bsearch() falls back to conceptually when data isn't sorted (though bsearch itself requires sorted input).",
    ],
    python: [
      "enumerate(arr) yields both the index and value together, avoiding manual index tracking.",
      "Returns -1 on failure to match the same convention as the C/Java versions, though Python more idiomatically might raise an exception.",
      "list.index(target) is the built-in equivalent, but raises ValueError instead of returning -1 if not found.",
      "The commented generator-expression version (next(... for ... ), -1) is a common idiomatic one-liner.",
      "Same O(n) complexity as C/Java — Python doesn't change the underlying algorithmic cost, only the syntax.",
    ],
  },

  "binary-search": {
    pseudoExplanation: [
      "Requires the array to already be sorted — this is the algorithm's core precondition.",
      "Look at the middle element of the current search range.",
      "If it equals the target, done. If the target is smaller, search the left half; if larger, search the right half.",
      "Repeat on the new, smaller half until the target is found or the range becomes empty.",
      "Each step cuts the search space in half, giving O(log n) time instead of linear search's O(n).",
    ],
    java: [
      "mid = left + (right - left) / 2 avoids integer overflow that (left + right) / 2 would risk for very large indices.",
      "The while (left <= right) loop continues until the search range collapses to nothing.",
      "Arrays.binarySearch() is Java's built-in equivalent, but it returns a negative insertion point instead of -1 when not found.",
      "Only works correctly if the input array is already sorted — passing unsorted data gives undefined results.",
      "O(log n) time and O(1) space make this far more efficient than linear search on large sorted datasets.",
    ],
    c: [
      "Uses the same overflow-safe mid calculation as the Java version — a classic interview gotcha to remember.",
      "C's stdlib provides bsearch(), a generic version using function pointers, but this manual version is fully transparent.",
      "No recursion needed — the iterative while-loop keeps stack usage at O(1), unlike a recursive implementation.",
      "left and right are plain ints representing inclusive bounds of the current search range.",
      "Like the Java version, behavior is undefined if the array isn't sorted beforehand.",
    ],
    python: [
      "Python integers never overflow, so (left + right) // 2 is perfectly safe here — no special trick needed.",
      "The // operator performs floor (integer) division, equivalent to C/Java's integer division.",
      "Python's bisect module (bisect_left, bisect_right) provides a production-ready, highly optimized binary search.",
      "Returns -1 on failure for consistency with the C/Java versions in this visualizer.",
      "Same O(log n) complexity — the language doesn't change the algorithm's fundamental efficiency.",
    ],
  },

  bfs: {
    pseudoExplanation: [
      "Start at a chosen node, mark it visited, and add it to a queue.",
      "While the queue isn't empty, remove the front node and 'visit' it (process it).",
      "Look at all of that node's unvisited neighbors, mark each one visited, and add them to the back of the queue.",
      "Repeat until the queue is empty — every reachable node has now been visited.",
      "Because nodes are processed in the order they were discovered, BFS explores level by level, making it ideal for shortest-path-by-edge-count problems.",
    ],
    java: [
      "Queue<String> (backed by LinkedList) models the FIFO behavior: poll() removes from the front, add() appends to the back.",
      "A HashSet<String> for visited gives O(1) average-case lookup, keeping the whole algorithm O(V + E).",
      "Initializing both visited and queue with the start node upfront avoids adding it twice later.",
      "Iterating graph.get(node) assumes an adjacency list represented as Map<String, List<String>>.",
      "This is the standard pattern used for shortest unweighted path and level-order traversal problems in Java.",
    ],
    c: [
      "A plain int array (queue[]) with front/back indices manually implements FIFO behavior — no library queue exists in core C.",
      "The adjacency matrix (adj[node][i]) makes neighbor lookup O(V) per node, giving O(V²) total — fine for small dense graphs.",
      "bool visited[6] requires stdbool.h and a fixed-size array, since C has no dynamic boolean vector by default.",
      "For sparse graphs or large V, an adjacency list (linked list of neighbors) would be far more memory-efficient than this matrix.",
      "front < back as the loop condition naturally stops once every enqueued node has been processed.",
    ],
    python: [
      "collections.deque is essential here — list.pop(0) is O(n), but deque.popleft() is O(1), keeping BFS at O(V+E).",
      "A Python set() for visited gives O(1) membership tests, just like Java's HashSet or a boolean array in C.",
      "The graph is represented as a plain dict mapping each node to a list of neighbor strings.",
      "deque([start]) and {start} both initialize with the start node already marked, preventing duplicate visits.",
      "This exact pattern generalizes directly to grid-based BFS (mazes, flood fill) by treating (row, col) tuples as nodes.",
    ],
  },

  dfs: {
    pseudoExplanation: [
      "Start at a node and mark it visited.",
      "Process the current node, then recursively visit one unvisited neighbor at a time.",
      "Each recursive call dives as deep as possible down one path before backtracking.",
      "Once a path is fully explored, backtrack to the most recent node with unvisited neighbors and continue from there.",
      "Continue until every reachable node has been visited — useful for cycle detection, topological sort, and connectivity checks.",
    ],
    java: [
      "Uses implicit recursion — the call stack itself acts as the 'stack' data structure DFS conceptually needs.",
      "The visited Set<String> is passed by reference through every recursive call, so all branches share the same state.",
      "if (visited.contains(node)) return; at the top is the base case that stops infinite recursion on cyclic graphs.",
      "For extremely deep or large graphs, an iterative version using an explicit Deque<String> avoids StackOverflowError.",
      "Visit order depends on the order neighbors appear in the adjacency list — different orderings give different (but still valid) DFS traversals.",
    ],
    c: [
      "visited[] is typically a global or passed-by-pointer array since C has no built-in dynamic set type.",
      "Recursive calls use the C call stack directly — same mechanism as Java, but with no automatic stack-overflow protection.",
      "The adjacency matrix again gives O(V) per-node neighbor scanning, so total complexity is O(V²) for dense representations.",
      "Must remember to reset/clear the visited array (e.g. via memset) before starting a fresh traversal.",
      "An iterative version using a manual int[] stack avoids recursion depth limits on very large or deep graphs.",
    ],
    python: [
      "visited=None as a default argument (instead of visited=set()) avoids Python's classic mutable-default-argument bug.",
      "The recursive version mirrors Java/C exactly; the iterative alternative uses a plain list as a LIFO stack via append()/pop().",
      "Note: iterative DFS using stack.pop() visits neighbors in the reverse order compared to the recursive version, since extend() pushes them all before popping.",
      "Python's default recursion limit (1000) can be a real constraint on deep graphs — sys.setrecursionlimit() raises it if needed.",
      "Both versions are O(V+E), same as the C/Java implementations — only the recursion mechanics differ.",
    ],
  },

  dijkstra: {
    pseudoExplanation: [
      "Set the distance to the start node as 0, and every other node as infinity.",
      "Repeatedly pick the unvisited node with the smallest known distance.",
      "Mark it visited, then check each of its neighbors: if going through this node gives a shorter path, update that neighbor's distance.",
      "Continue until every node has been visited (or the priority queue/candidate list is empty).",
      "The final distance array holds the shortest path length from the start node to every other node.",
    ],
    java: [
      "PriorityQueue<int[]> with a comparator on distance acts as a min-heap, giving O((V+E) log V) total time.",
      "Each heap entry is {distance, node} — when popped, if (visited[u]) continue; skips stale duplicate entries.",
      "Integer.MAX_VALUE represents 'infinity'; care is needed to avoid integer overflow when adding edge weights to it.",
      "graph[u][v] > 0 checks both that an edge exists and implicitly assumes non-negative weights, which Dijkstra requires.",
      "This heap-based approach scales far better than the O(V²) array-scan version on sparse graphs with many nodes.",
    ],
    c: [
      "Uses the simpler O(V²) approach: min_dist() linearly scans all unvisited nodes each round instead of using a heap.",
      "INF is defined as 1e9 — large enough to represent 'unreachable' without risking overflow on accumulation.",
      "For dense or small graphs (like this visualizer's examples), O(V²) is perfectly fine and avoids implementing a heap in C.",
      "For large sparse graphs, a binary heap or pairing heap would reduce this to O((V+E) log V), matching the Java version.",
      "vis[] tracks finalized nodes — once a node is marked visited, its shortest distance is guaranteed correct and never revisited.",
    ],
    python: [
      "heapq implements a binary min-heap; pushing tuples (distance, node) works because Python compares tuples lexicographically.",
      "if d > dist[u]: continue skips 'stale' heap entries — a lazy-deletion trick instead of a true decrease-key operation.",
      "float('inf') is the idiomatic Python way to represent unreachable/infinite distance.",
      "The graph here is a dict of dicts: graph[u][v] gives the weight of the edge from u to v.",
      "This matches the Java priority-queue approach in complexity — O((V+E) log V) — while being noticeably more concise.",
    ],
  },

  "tree-traversal": {
    pseudoExplanation: [
      "An inorder traversal visits the left subtree first, then the current node, then the right subtree.",
      "This pattern recurses: 'inorder(left), visit(node), inorder(right)' applied at every node.",
      "For a binary search tree specifically, inorder traversal always visits nodes in ascending sorted order.",
      "Preorder (visit, left, right) and postorder (left, right, visit) just reorder when the current node is processed.",
      "The base case is always a null/None node — recursion simply returns without doing anything.",
    ],
    java: [
      "TreeNode is a simple class with val, left, and right fields — the canonical binary tree representation in Java.",
      "The recursive inorder() is only 3 meaningful lines, showing how naturally recursion expresses tree traversal.",
      "The iterative version uses an explicit Deque<TreeNode> as a stack, pushing left children until hitting null, then popping and going right.",
      "Switching where System.out.print(root.val) appears (before vs. after the recursive calls) changes inorder into preorder or postorder.",
      "The iterative version avoids Java's call-stack depth limit, useful for very unbalanced or deep trees.",
    ],
    c: [
      "Node uses self-referential struct pointers (struct Node *left/right) — the standard way C represents tree nodes.",
      "Arrow notation (root->left) is just syntactic sugar for dereferencing the pointer and accessing a field: (*root).left.",
      "if (!root) return; is the mandatory base case — forgetting this causes a NULL pointer dereference crash.",
      "No automatic memory management exists, so freeing tree nodes after use requires a separate recursive free function.",
      "Reordering the printf() call relative to the two recursive calls is the only change needed to get preorder or postorder.",
    ],
    python: [
      "The 'inorder' function builds and concatenates lists (inorder(left) + [val] + inorder(right)), which is elegant but creates many temporary lists.",
      "The inorder_list() variant passes a shared result list by reference and uses append(), avoiding that memory overhead.",
      "result=None as a default argument (rather than result=[]) avoids Python's mutable-default-argument pitfall, same issue seen in DFS.",
      "Python's default recursion limit (1000 frames) can be exceeded on deep, unbalanced trees — sys.setrecursionlimit() can raise it if truly needed.",
      "Since Python has first-class None, checking 'if root is None' is the idiomatic null-check equivalent to C's '!root'.",
    ],
  },

  "bst-insert": {
    pseudoExplanation: [
      "Compare the value to insert against the current node's value.",
      "If smaller, recurse into the left subtree; if larger, recurse into the right subtree.",
      "If the current node is null/None, that's the correct empty spot — create a new node there.",
      "Each recursive call returns the (possibly newly created) subtree, which gets reattached to its parent.",
      "Duplicate values are typically just ignored, since they don't change the tree's search structure.",
    ],
    java: [
      "insert() returns a TreeNode at every level — this lets root.left = insert(root.left, val) handle both 'create new node' and 'recurse deeper' uniformly.",
      "When root == null, a brand-new TreeNode(val) is returned, becoming the leaf at that position.",
      "Duplicate values (val == root.val) fall through both if/else branches and simply return root unchanged.",
      "A BST built by inserting already-sorted data degenerates into a linked list with O(n) operations — self-balancing trees (AVL, Red-Black) fix this.",
      "This recursive style is idiomatic Java; an iterative version with manual pointer-following is also common in performance-critical code.",
    ],
    c: [
      "new_node() wraps malloc() to allocate heap memory for each tree node — every insertion costs one malloc call.",
      "Production C code should always check that malloc's return value isn't NULL before dereferencing it.",
      "root->left = insert(root->left, val) mirrors the Java pattern exactly, just using arrow notation for pointer field access.",
      "Memory for the entire tree must eventually be freed manually with a recursive free function — C has no garbage collector.",
      "Like the Java version, inserting pre-sorted data creates a degenerate, unbalanced linked-list-like tree.",
    ],
    python: [
      "TreeNode.__init__ sets left and right to None by default, matching C's NULL and Java's null conceptually.",
      "The same root = insert(root.left, val) pattern from Java/C applies, since Python functions can also return values used to reassign attributes.",
      "Building a tree from a list typically looks like: for v in values: root = insert(root, v).",
      "Python's dynamic typing means this same insert() function works for any comparable type (ints, strings, etc.) without modification.",
      "Recursion depth matters here too — a very unbalanced tree from sorted input could approach Python's default 1000-frame recursion limit.",
    ],
  },

  fibonacci: {
    pseudoExplanation: [
      "The base cases are fib(0) = 0 and fib(1) = 1.",
      "For any n > 1, fib(n) = fib(n-1) + fib(n-2) — each number is the sum of the two before it.",
      "The naive recursive version recomputes the same smaller subproblems repeatedly, leading to exponential time.",
      "An iterative version tracks only the last two values, achieving linear time with constant space.",
      "Memoization caches each subproblem's result the first time it's computed, turning the recursive version into linear time too.",
    ],
    java: [
      "fib() is the naive O(2^n) recursive version — useful for visualizing the call tree, not for real performance.",
      "fibFast() keeps just two rolling variables (a, b), reaching O(n) time and O(1) space — the version you'd actually use.",
      "fibMemo() uses a static HashMap<Integer,Integer> with computeIfAbsent() to cache each result exactly once.",
      "int overflows around fib(47) — for larger values, switch to long or BigInteger.",
      "The three versions demonstrate the classic 'naive → memoized → iterative' optimization progression seen across many algorithms.",
    ],
    c: [
      "fib() mirrors the naive exponential recursive definition directly from the math formula.",
      "fib_fast() uses three plain ints (a, b, c) in a loop — no recursion, no extra memory, O(n) time.",
      "fib_memo() uses a static int cache[100] array; since C has no built-in hash map, memoization here is array-based with a fixed upper bound.",
      "int will overflow around fib(47); use long long and adjust the cache array type for larger Fibonacci numbers.",
      "The static cache persists between calls within the same program run, so repeated calls benefit from previously computed values.",
    ],
    python: [
      "The recursive fib() is the most direct translation of the mathematical definition, but is exponential — slow beyond n≈35.",
      "fib_fast() uses Python's tuple reassignment (a, b = b, a + b), which evaluates the right side fully before assigning — clean and idiomatic.",
      "@lru_cache(maxsize=None) is Python's built-in memoization decorator — it turns the naive recursive function into O(n) with a single line.",
      "Python integers have arbitrary precision, so unlike C/Java, there's no overflow concern even for very large n.",
      "This progression (naive → lru_cache → iterative) is a great illustration of why memoization matters before reaching for full iteration.",
    ],
  },

  "two-pointers": {
    pseudoExplanation: [
      "Requires the array to be sorted — this is what makes the technique work.",
      "Place one pointer at the start (left) and one at the end (right) of the array.",
      "If the sum of both pointed-to values equals the target, a pair is found.",
      "If the sum is too small, move left forward (to increase the sum); if too large, move right backward (to decrease it).",
      "Continue until the pointers meet or a match is found — this runs in O(n) instead of the O(n²) brute-force approach.",
    ],
    java: [
      "left starts at index 0, right starts at arr.length - 1 — both pointers move inward toward each other.",
      "Returns an int[]{left, right} pair of indices, or {-1, -1} if no pair sums to target.",
      "The key insight is monotonicity: since the array is sorted, moving either pointer changes the sum predictably in one direction.",
      "This technique generalizes to problems like 'container with most water' and removing duplicates in-place.",
      "O(n) time, O(1) extra space — a major improvement over the naive nested-loop O(n²) pair-search approach.",
    ],
    c: [
      "Since C functions can't return multiple values cleanly, output parameters (int *lo, int *hi) are used instead.",
      "The function returns 1/0 as a success flag, while the actual indices are written through the pointers.",
      "(*lo)++ and (*hi)-- dereference the pointers to modify the caller's variables directly.",
      "This output-parameter pattern is extremely common throughout the C standard library (e.g. scanf, modf).",
      "Same O(n) time complexity as the Java/Python versions — only the calling convention differs.",
    ],
    python: [
      "Python's native multiple return (return left, right) makes the API cleaner than C's output-parameter style.",
      "Callers can use tuple unpacking directly: lo, hi = two_sum(arr, target).",
      "The same left/right pointer logic applies identically — sorted input is still a hard requirement.",
      "This pattern extends naturally to three-sum problems by fixing one pointer and running two-pointers on the remainder.",
      "Still O(n) time and O(1) extra space, matching the C/Java versions exactly.",
    ],
  },

  "ft-split": {
    pseudoExplanation: [
      "Scan through the string looking for runs of the separator character to skip over.",
      "When a non-separator character is found, that's the start of a new word.",
      "Keep advancing until the next separator (or end of string) to find where the word ends.",
      "Record that word, then continue scanning from where you left off.",
      "Repeat until the entire string has been scanned, producing a list/array of all words found.",
    ],
    java: [
      "Builds words using a List<String> (ArrayList) which grows dynamically — no need to pre-count words like in C.",
      "toArray(new String[0]) converts the final list into the String[] return type required by the function signature.",
      "Java's built-in String.split() achieves the same result in one line, but this manual version mirrors the C/libft logic step by step.",
      "substring(start, i) extracts exactly the word found between the two scanning pointers.",
      "Consecutive separator characters are automatically skipped by the inner while-loop, just like the C version.",
    ],
    c: [
      "Requires two full passes: count_words() first determines how many words exist so the outer malloc can be sized correctly.",
      "char **res is an array of string pointers — the classic 'array of strings' pattern in C.",
      "Each word gets its own malloc'd buffer; the NULL sentinel terminates the array so callers can loop without needing a separate count.",
      "Forgetting to free every individual string AND the outer array is a common memory leak in this exact libft function.",
      "This is one of the most frequently implemented and tested functions in the 42 curriculum's libft project.",
    ],
    python: [
      "The manual while-loop version exists purely to mirror the C logic step-by-step for comparison.",
      "The one-liner ([w for w in s.split(c) if w]) leverages Python's built-in split() plus a filter to drop empty strings.",
      "Python's str.split(c) actually already collapses consecutive separators when called with a single-character separator in some cases — worth testing carefully against ft_split's exact semantics.",
      "No manual memory management needed — Python's garbage collector handles cleanup automatically, unlike the C version's malloc/free pairs.",
      "Returns a Python list, which is dynamically sized and needs no pre-counting pass, unlike the C version's two-pass approach.",
    ],
  },

  "ft-itoa": {
    pseudoExplanation: [
      "Handle the special case of n == 0 separately, returning the string \"0\" directly.",
      "Record whether the number is negative, then work with its absolute value for digit extraction.",
      "Repeatedly take the number modulo 10 to get the last digit, then divide by 10 to remove it.",
      "Each extracted digit comes out in reverse order, so they must be assembled back-to-front.",
      "If the original number was negative, prepend a '-' sign to the final result.",
    ],
    java: [
      "Casting n to long before negation is essential — it avoids overflow when n is Integer.MIN_VALUE, whose absolute value doesn't fit in an int.",
      "StringBuilder.insert(0, ch) prepends each digit, effectively reversing the right-to-left extraction order.",
      "val % 10 gives the next digit, val /= 10 removes it — the same digit-extraction trick used in the C and Python versions.",
      "The 'if (neg) sb.insert(0, '-')' step happens after all digits are added, putting the sign at the very front.",
      "Java's Integer.toString(n) does this natively, but this manual version demonstrates the underlying digit math.",
    ],
    c: [
      "Casts to long immediately to handle the INT_MIN edge case, where -n would otherwise overflow as a plain int.",
      "First computes the exact string length needed, then calls malloc((len + 1) for the null terminator before writing any digits.",
      "Fills the string from right to left using len-- as the write position, since digits come out in reverse order from % 10 and / 10.",
      "The negative sign, if present, is written to str[0] before the digit-filling loop begins.",
      "The caller is responsible for calling free() on the returned string — a very common 42 exam memory-leak trap if forgotten.",
    ],
    python: [
      "Python integers have arbitrary precision, so there's no INT_MIN overflow concern unlike the C/Java versions.",
      "abs(n) cleanly handles the sign separately from the digit-extraction loop, identical in spirit to the C/Java approach.",
      "chr(ord('0') + digit) converts a numeric digit (0-9) into its corresponding character — same trick as C's '0' + digit.",
      "''.join(reversed(digits)) assembles the final string, since digits were collected in reverse (least-significant first).",
      "In real Python code you'd simply use str(n) — this manual version exists to demonstrate the underlying algorithm taught in 42's libft.",
    ],
  },

  "ft-atoi": {
    pseudoExplanation: [
      "Skip any leading whitespace characters (spaces, tabs, newlines, etc.).",
      "Check for an optional leading '+' or '-' sign and record it.",
      "Read consecutive digit characters, building up the resulting number one digit at a time.",
      "Stop as soon as a non-digit character is encountered (the rest of the string is ignored).",
      "Apply the recorded sign to the final accumulated number before returning it.",
    ],
    java: [
      "The three-phase pattern (skip whitespace → read sign → accumulate digits) is the universal atoi algorithm structure.",
      "Character.isDigit() cleanly checks whether a char is a digit, avoiding manual ASCII range comparisons.",
      "result = result * 10 + (digit) builds the number left-to-right, multiplying by 10 to 'shift' previous digits up a place.",
      "This simplified version doesn't clamp on overflow — for full correctness, compute using long and clamp to Integer.MIN/MAX_VALUE.",
      "Java's Integer.parseInt() throws an exception on invalid input instead of silently returning 0, a key behavioral difference from atoi.",
    ],
    c: [
      "Whitespace is checked against raw ASCII values: 32 for space, and the range 9-13 for tab/newline/vertical-tab/form-feed/carriage-return.",
      "Digits are detected with str[i] >= '0' && str[i] <= '9', the idiomatic C way to check character ranges without a helper function.",
      "No standard library function is used at all — this is built entirely from raw character comparisons, fitting libft's 'no stdlib' constraint.",
      "result = result * 10 + (str[i++] - '0') both reads and advances the index i in the same expression, a common compact C idiom.",
      "On overflow, this implementation has undefined behavior — the real atoi() in C also doesn't guarantee defined behavior on overflow.",
    ],
    python: [
      "s[i] in ' \\t\\n\\r\\f\\v' checks membership against a string of whitespace characters, a clean way to test multiple options in Python.",
      "s[i].isdigit() is the Python equivalent of C's manual ASCII range check, more readable but functionally identical.",
      "sign = -1 if s[i] == '-' else 1 is a compact conditional expression (Python's ternary) used to set the sign in one line.",
      "Python's own int(s) handles whitespace and signs automatically and never silently overflows, unlike the manual C-style version here.",
      "This function intentionally mimics C's atoi behavior (e.g. stopping at the first non-digit) rather than Python's stricter int() parsing.",
    ],
  },

  "ft-union": {
    pseudoExplanation: [
      "Walk through the first string, then the second string, in order.",
      "Keep track of which characters have already been output, using a fast lookup structure.",
      "For each character, if it hasn't been seen yet, output it and mark it as seen.",
      "If it has already been seen, skip it — duplicates across both strings are removed.",
      "The result is every distinct character from both strings, in the order they first appeared.",
    ],
    java: [
      "A boolean[256] array acts as a constant-time 'seen' set indexed directly by character code — fast and simple for ASCII text.",
      "Iterating s1 then s2 in a small loop ({s1, s2}) keeps the logic compact while preserving the s1-then-s2 ordering requirement.",
      "Casting char to int gives the index into the seen[] array, since Java's char is a 16-bit Unicode code unit.",
      "StringBuilder accumulates the result efficiently, avoiding the O(n²) cost of repeated String concatenation.",
      "This boolean-array approach only works correctly for single-byte/ASCII-range characters — full Unicode would need a HashSet<Character> instead.",
    ],
    c: [
      "char seen[256], zeroed with ft_memset, gives O(1) lookup by character value — the same idea as the Java boolean array.",
      "Casting to (unsigned char) before indexing is critical: plain char can be negative on some platforms, which would cause an out-of-bounds array access.",
      "write(1, &s1[i], 1) writes one character directly to stdout (file descriptor 1) — no printf is used, per libft's exam constraints.",
      "Two separate while-loops process s1 and s2 in sequence, both checking and updating the same shared seen[] array.",
      "This exact pattern (seen array + write()) is one of the most common building blocks across many 42 Piscine exam exercises.",
    ],
    python: [
      "A Python set() gives O(1) average-case membership testing, directly analogous to the boolean array in C/Java.",
      "Iterating s1 + s2 as one combined loop achieves the same s1-then-s2 ordering with slightly more concise code.",
      "The commented one-liner using dict.fromkeys(s1 + s2) exploits the fact that dicts preserve insertion order (Python 3.7+) while deduplicating keys.",
      "''.join(result) efficiently builds the final string from the list of unique characters collected.",
      "Unlike the C version, there's no risk of negative-index bugs here since Python strings are full Unicode and sets handle any character safely.",
    ],
  },

  "ft-inter": {
    pseudoExplanation: [
      "First, record every character that appears anywhere in the second string.",
      "Then walk through the first string in order, character by character.",
      "For each character, check if it was marked as present in the second string.",
      "If it was present and hasn't already been output, output it and mark it as printed.",
      "The result is every character common to both strings, in the order they appear in the first string, with no duplicates.",
    ],
    java: [
      "Uses two separate boolean[256] arrays: inS2 marks membership, printed prevents duplicate output — a clean two-array separation of concerns.",
      "The first pass over s2 just populates inS2[]; the second pass over s1 does the actual filtering and output building.",
      "Casting char to int for array indexing is the same Unicode-code-unit trick used in the ft_union implementation.",
      "An alternative approach using Set<Character> intersection would work too, but the boolean-array version is faster for small ASCII alphabets.",
      "Time complexity is O(len(s1) + len(s2)), since both passes are linear and array lookups are O(1).",
    ],
    c: [
      "Uses a single char map[256] array with two distinct marker values: 1 means 'seen in s2', 2 means 'already printed' — an elegant space-saving trick over using two separate arrays.",
      "The first while-loop only marks chars from s2 with value 1; it doesn't touch s1 at all yet.",
      "The second while-loop checks map[char] == 1 specifically (not just truthy), then upgrades it to 2 so it's never printed twice.",
      "write(1, &s1[i], 1) again outputs one byte directly, consistent with the no-printf constraint used throughout libft/42 exam code.",
      "This single-array two-value trick is a very common 42 Piscine pattern worth memorizing — it shows up in several other exam exercises too.",
    ],
    python: [
      "Two Python sets — in_s2 for membership and seen for de-duplication — directly mirror the C version's map[] value-1/value-2 trick, just using two separate sets instead of one array with two markers.",
      "set(s2) builds the membership-check set in a single, clear line, unlike C's explicit marking loop.",
      "Iterating 'for c in s1' preserves the result's ordering based on s1, exactly matching the C and Java semantics.",
      "The commented compact version using dict.fromkeys() with a generator expression achieves the same O(n) result in a more functional style.",
      "''.join(result) at the end converts the list of characters back into the final printable string.",
    ],
  },

  "last-word": {
    pseudoExplanation: [
      "Start scanning from the very end of the string, moving backward.",
      "Skip over any trailing space characters first.",
      "Once a non-space character is found, that marks the end of the last word.",
      "Keep moving backward until either a space or the start of the string is reached — that marks the start of the last word.",
      "Extract and output the substring between those two boundaries.",
    ],
    java: [
      "Starts at s.length() - 1 and walks backward — the reverse direction compared to how strings are normally scanned.",
      "The 'end' variable freezes the position right after skipping trailing spaces, marking where the word's last character is.",
      "The second while-loop continues backward until hitting a space or the start of the string, locating the word's first character.",
      "substring(i + 1, end + 1) carefully adjusts both boundaries by one, since i ends one position before the word actually starts.",
      "The commented one-liner (strip().split(\"\\\\s+\")) is the idiomatic Java way, though it needs a guard for all-whitespace input.",
    ],
    c: [
      "Like the Java version, scanning starts from the string's end and moves backward using decrementing index i.",
      "The tricky '++i <= end' in the final loop is a pre-increment: it moves i forward to the word's first character before the comparison happens, then prints through 'end'.",
      "write(1, &s[i], 1) outputs exactly one character at a time, with no printf or string-building buffer used.",
      "This backward-scan pattern (skip trailing whitespace, then find word boundaries) is the standard professional approach to 'last word' style 42 exam exercises.",
      "Edge cases like an all-space string need careful handling — the loop simply produces no output if no word is found.",
    ],
    python: [
      "The manual version mirrors the C backward-scan logic exactly, decrementing i in two separate while-loops.",
      "s[i + 1 : end + 1] is Python's slice syntax doing the same boundary extraction as Java's substring(i+1, end+1).",
      "The Pythonic one-liner (s.rstrip().split()[-1]) is far shorter: rstrip() removes trailing whitespace, split() (no args) splits on any run of whitespace.",
      "Both versions need a guard against all-whitespace input — the one-liner would raise an IndexError if split() returns an empty list.",
      "This contrast (manual scan vs. one-liner) is a good illustration of how much built-in string methods can simplify common C-style string algorithms in Python.",
    ],
  },
};
