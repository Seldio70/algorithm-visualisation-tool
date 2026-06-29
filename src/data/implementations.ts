export interface LanguageImpl {
  code: string;
  note: string;
}

export interface AlgorithmImpl {
  java: LanguageImpl;
  c: LanguageImpl;
  python: LanguageImpl;
}

export const IMPLEMENTATIONS: Record<string, AlgorithmImpl> = {
  "bubble-sort": {
    java: {
      code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      note: "Java arrays are passed by reference, so the swap modifies the original array in-place. The inner loop boundary shrinks by one each pass because the last i elements are already sorted.",
    },
    c: {
      code: `void bubble_sort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      note: "The array is passed as a pointer, so swaps directly modify memory. No stdlib needed — just a temp variable for the swap. This is the idiomatic C version.",
    },
    python: {
      code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
      note: "Python's tuple swap makes the code one line shorter than Java/C. The list is mutated in-place. For read-only input, copy first: arr = list(original).",
    },
  },

  "selection-sort": {
    java: {
      code: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}`,
      note: "Selection sort performs exactly n-1 swaps regardless of input order, making it predictable. Java's lack of multiple return values means we track the min index rather than the value.",
    },
    c: {
      code: `void selection_sort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
      note: "The C version is structurally identical to Java. In embedded C where write operations are expensive, selection sort's O(n) swap count can be preferable to bubble sort's O(n²) swaps.",
    },
    python: {
      code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
      note: "Python's enumerate() could replace the inner loop, but the index-based approach is kept here to match the C/Java logic exactly. The tuple swap at the end avoids a temp variable.",
    },
  },

  "insertion-sort": {
    java: {
      code: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      note: "The 'key' variable saves the element being inserted while we shift larger elements right. j ends at the insertion point minus one, so arr[j+1] is the correct final position.",
    },
    c: {
      code: `void insertion_sort(int *arr, int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      note: "Identical logic to Java. This is one of the few sorts where C and Java implementations look nearly the same. Insertion sort's O(n) best case makes it ideal for nearly-sorted data.",
    },
    python: {
      code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
      note: "Python's built-in sort (Timsort) uses insertion sort internally for small subarrays because it's efficient on partially-sorted data. This implementation is used for educational clarity.",
    },
  },

  "merge-sort": {
    java: {
      code: `public static void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}

private static void merge(int[] arr, int l, int mid, int r) {
    int[] tmp = new int[r - l + 1];
    int i = l, j = mid + 1, k = 0;
    while (i <= mid && j <= r)
        tmp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
    while (i <= mid) tmp[k++] = arr[i++];
    while (j <= r)   tmp[k++] = arr[j++];
    for (int m = 0; m < tmp.length; m++)
        arr[l + m] = tmp[m];
}`,
      note: "The merge step requires O(n) extra space for the temporary array. Stable sort: equal elements preserve their original order. Java's Arrays.sort() uses a variant of merge sort for objects.",
    },
    c: {
      code: `void merge(int *arr, int l, int mid, int r) {
    int n1 = mid - l + 1, n2 = r - mid;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2)
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void merge_sort(int *arr, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    merge_sort(arr, l, mid);
    merge_sort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}`,
      note: "C uses VLAs (variable-length arrays) for the left/right buffers — simpler than malloc/free here. For production, prefer malloc to avoid stack overflow on large inputs.",
    },
    python: {
      code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return _merge(left, right)

def _merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
      note: "Python's slice notation (arr[:mid]) creates new lists, making the code cleaner but using more memory than the in-place C/Java versions. The function returns a new sorted list rather than mutating in place.",
    },
  },

  "quick-sort": {
    java: {
      code: `public static void quickSort(int[] arr, int low, int high) {
    if (low >= high) return;
    int p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            int tmp = arr[++i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }
    int tmp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = tmp;
    return i + 1;
}`,
      note: "Lomuto partition scheme: pivot is always the last element. After partitioning, the pivot is in its final sorted position. Java's Arrays.sort() uses dual-pivot quicksort for primitives.",
    },
    c: {
      code: `int partition(int *arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            int tmp = arr[++i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }
    int tmp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = tmp;
    return i + 1;
}

void quick_sort(int *arr, int low, int high) {
    if (low >= high) return;
    int p = partition(arr, low, high);
    quick_sort(arr, low, p - 1);
    quick_sort(arr, p + 1, high);
}`,
      note: "Identical logic to Java. C's qsort() in stdlib.h uses a different comparison function pattern, but internally uses a similar partitioning strategy. Worst case O(n²) occurs on already-sorted input with this pivot choice.",
    },
    python: {
      code: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low >= high:
        return
    p = partition(arr, low, high)
    quick_sort(arr, low, p - 1)
    quick_sort(arr, p + 1, high)

def partition(arr, low, high):
    pivot, i = arr[high], low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      note: "Python sets high=None by default so callers just write quick_sort(arr). Python's built-in sort() (Timsort) is faster in practice, but this shows the classical quicksort algorithm.",
    },
  },

  "linear-search": {
    java: {
      code: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1; // not found
}`,
      note: "Returns the index of the first match, or -1 if not found. In Java you can also use Arrays.asList(arr).indexOf(target) for Object arrays, but that doesn't work on primitive int[].",
    },
    c: {
      code: `int linear_search(int *arr, int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}`,
      note: "C doesn't know array length from the pointer alone, so n is passed explicitly. The C standard library has no built-in linear search; this is the standard manual implementation.",
    },
    python: {
      code: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Python one-liner alternative:
# index = next((i for i, v in enumerate(arr) if v == target), -1)`,
      note: "enumerate() gives both index and value cleanly. Python's list.index(target) does the same but raises ValueError if not found. The generator expression version is idiomatic for experienced Pythonistas.",
    },
  },

  "binary-search": {
    java: {
      code: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // avoids int overflow
        if (arr[mid] == target)  return mid;
        else if (arr[mid] < target) left = mid + 1;
        else                        right = mid - 1;
    }
    return -1;
}`,
      note: "mid = left + (right - left) / 2 prevents integer overflow that (left + right) / 2 would cause for very large indices. Java's Arrays.binarySearch() returns a negative value (insertion point) when not found.",
    },
    c: {
      code: `int binary_search(int *arr, int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target)  return mid;
        else if (arr[mid] < target) left = mid + 1;
        else                        right = mid - 1;
    }
    return -1;
}`,
      note: "The C stdlib provides bsearch(), but this manual version makes the algorithm transparent. Always prefer the overflow-safe mid calculation — it's a classic interview pitfall.",
    },
    python: {
      code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2  # no overflow in Python
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Python stdlib: bisect.bisect_left(arr, target)`,
      note: "Python integers don't overflow, so (left + right) // 2 is safe. The bisect module provides production-ready binary search. The // operator does integer (floor) division.",
    },
  },

  "bfs": {
    java: {
      code: `import java.util.*;

public static void bfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>(List.of(start));
    Queue<String> queue = new LinkedList<>(List.of(start));

    while (!queue.isEmpty()) {
        String node = queue.poll();
        System.out.println("Visit: " + node);
        for (String neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
}`,
      note: "Java's Queue interface (implemented by LinkedList) models the FIFO queue cleanly. poll() removes from the front; add() appends to the back. HashSet gives O(1) visited lookups.",
    },
    c: {
      code: `#include <stdbool.h>

/* adj[i][j] = 1 means edge between nodes i and j */
void bfs(int adj[][6], int n, int start) {
    bool visited[6] = {false};
    int  queue[6], front = 0, back = 0;

    visited[start] = true;
    queue[back++] = start;

    while (front < back) {
        int node = queue[front++];
        printf("%d ", node);
        for (int i = 0; i < n; i++) {
            if (adj[node][i] && !visited[i]) {
                visited[i] = true;
                queue[back++] = i;
            }
        }
    }
}`,
      note: "C uses an integer array as a manual queue (front/back indices). The adjacency matrix makes neighbor lookup O(V) but keeps the code straightforward. For sparse graphs, an adjacency list is more memory-efficient.",
    },
    python: {
      code: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue   = deque([start])

    while queue:
        node = queue.popleft()
        print("Visit:", node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# Example graph (adjacency list):
# graph = {"A": ["B","C"], "B": ["D"], "C": ["D"], "D": []}`,
      note: "deque.popleft() is O(1) — never use list.pop(0) for BFS as it's O(n). Python sets give O(1) membership checks. The graph is a plain dict mapping node labels to neighbor lists.",
    },
  },

  "dfs": {
    java: {
      code: `import java.util.*;

public static void dfs(
    Map<String, List<String>> graph,
    String node,
    Set<String> visited
) {
    if (visited.contains(node)) return;
    visited.add(node);
    System.out.println("Visit: " + node);
    for (String neighbor : graph.get(node)) {
        dfs(graph, neighbor, visited);
    }
}

// Call: dfs(graph, "A", new HashSet<>());`,
      note: "Recursive DFS uses the call stack implicitly. The visited set is passed by reference so all recursive calls share it. For very deep graphs, convert to an iterative version with an explicit Stack to avoid StackOverflowError.",
    },
    c: {
      code: `#include <stdbool.h>

bool visited[6];

void dfs(int adj[][6], int node, int n) {
    visited[node] = true;
    printf("%d ", node);
    for (int i = 0; i < n; i++) {
        if (adj[node][i] && !visited[i])
            dfs(adj, i, n);
    }
}

// Init: memset(visited, 0, sizeof(visited));
// Then: dfs(adj, 0, 6);`,
      note: "In C, the visited array is global (or passed as a parameter). The adjacency matrix makes this O(V²). For sparse graphs in C, linked-list adjacency is preferred. Watch out for stack depth on large graphs.",
    },
    python: {
      code: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print("Visit:", node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# Iterative alternative:
def dfs_iterative(graph, start):
    visited, stack = set(), [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node); print(node)
            stack.extend(graph[node])`,
      note: "visited=None default avoids the mutable default argument bug. The iterative version uses a list as a stack (LIFO). Note that iterative DFS visits neighbors in reverse order compared to recursive DFS.",
    },
  },

  "dijkstra": {
    java: {
      code: `import java.util.*;

public static int[] dijkstra(int[][] graph, int src) {
    int n = graph.length;
    int[] dist = new int[n];
    boolean[] visited = new boolean[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    // min-heap: [distance, node]
    PriorityQueue<int[]> pq = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0])
    );
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[1];
        if (visited[u]) continue;
        visited[u] = true;
        for (int v = 0; v < n; v++) {
            if (graph[u][v] > 0 && !visited[v]) {
                int d = dist[u] + graph[u][v];
                if (d < dist[v]) {
                    dist[v] = d;
                    pq.offer(new int[]{d, v});
                }
            }
        }
    }
    return dist;
}`,
      note: "PriorityQueue gives O(E log V) complexity. The visited check after poll() handles duplicate entries in the heap. Integer.MAX_VALUE represents infinity — add guard against overflow when computing dist[u] + weight.",
    },
    c: {
      code: `#include <stdbool.h>
#define V   5
#define INF 1e9

int min_dist(int dist[], bool vis[]) {
    int min = INF, idx = -1;
    for (int v = 0; v < V; v++)
        if (!vis[v] && dist[v] < min)
            { min = dist[v]; idx = v; }
    return idx;
}

void dijkstra(int graph[][V], int src, int dist[]) {
    bool vis[V] = {false};
    for (int i = 0; i < V; i++) dist[i] = INF;
    dist[src] = 0;
    for (int count = 0; count < V - 1; count++) {
        int u = min_dist(dist, vis);
        vis[u] = true;
        for (int v = 0; v < V; v++) {
            if (!vis[v] && graph[u][v]
                && dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
        }
    }
}`,
      note: "This O(V²) version avoids a priority queue — fine for small dense graphs like in the visualizer. The min_dist helper scans all nodes each round. For sparse graphs with millions of nodes, a heap is essential.",
    },
    python: {
      code: `import heapq

def dijkstra(graph, src):
    dist = {node: float('inf') for node in graph}
    dist[src] = 0
    heap = [(0, src)]  # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue  # stale entry
        for v, weight in graph[u].items():
            nd = dist[u] + weight
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist

# graph = {"A": {"B": 2, "C": 4}, "B": {"C": 1}, "C": {}}`,
      note: "heapq implements a min-heap. Python tuples compare lexicographically, so (distance, node) naturally orders by distance. float('inf') is idiomatic for infinity. The stale-entry skip avoids a decrease-key operation.",
    },
  },

  "tree-traversal": {
    java: {
      code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

// Inorder: left → root → right
public static void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);
    System.out.print(root.val + " ");
    inorder(root.right);
}

// Iterative inorder with explicit stack:
public static List<Integer> inorderIter(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        result.add(curr.val);
        curr = curr.right;
    }
    return result;
}`,
      note: "The recursive version is 3 lines of actual logic. The iterative version avoids call-stack limits for deep trees and is the pattern used in coding interviews. Change the System.out.print position for preorder (before left) or postorder (after right).",
    },
    c: {
      code: `typedef struct Node {
    int val;
    struct Node *left;
    struct Node *right;
} Node;

// Inorder: left → root → right
void inorder(Node *root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->val);
    inorder(root->right);
}

// Preorder:  process root, then left, then right
// Postorder: process left, right, then root`,
      note: "C uses struct with self-referential pointers for the node. Arrow notation (root->val) dereferences the pointer and accesses the field. Always check for NULL before recursing — it's the base case.",
    },
    python: {
      code: `class TreeNode:
    def __init__(self, val):
        self.val  = val
        self.left = None
        self.right = None

# Inorder: left → root → right
def inorder(root):
    if root is None:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# In-place with a list:
def inorder_list(root, result=None):
    if result is None: result = []
    if root:
        inorder_list(root.left, result)
        result.append(root.val)
        inorder_list(root.right, result)
    return result`,
      note: "The list-concatenation version is clean but creates many temporary lists. The in-place version using result.append() is more memory-efficient. Python's recursion limit defaults to 1000 — use sys.setrecursionlimit() for deep trees.",
    },
  },

  "bst-insert": {
    java: {
      code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public static TreeNode insert(TreeNode root, int val) {
    if (root == null)
        return new TreeNode(val);
    if (val < root.val)
        root.left  = insert(root.left, val);
    else if (val > root.val)
        root.right = insert(root.right, val);
    // duplicates are ignored (val == root.val)
    return root;
}`,
      note: "The recursive approach returns the (possibly new) subtree root at each level, which is why root.left = insert(...) works — it handles both the 'create new node' case and the 'recurse deeper' case uniformly.",
    },
    c: {
      code: `#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *left;
    struct Node *right;
} Node;

Node *new_node(int val) {
    Node *n = malloc(sizeof(Node));
    n->val = val;
    n->left = n->right = NULL;
    return n;
}

Node *insert(Node *root, int val) {
    if (!root) return new_node(val);
    if      (val < root->val) root->left  = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}`,
      note: "Every node requires a malloc call. In production C code, always check that malloc returns non-NULL. A BST built from a sorted input degrades to a linked list — consider AVL or Red-Black trees for balanced insertion.",
    },
    python: {
      code: `class TreeNode:
    def __init__(self, val):
        self.val  = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left  = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root  # duplicate: return unchanged

# Build a BST from a list:
# root = None
# for v in [5, 3, 7, 1]: root = insert(root, v)`,
      note: "Python's None stands in for null pointers cleanly. The 'Build a BST' snippet shows the typical usage pattern. Python's recursion limit can be hit for very unbalanced trees — an iterative version avoids this.",
    },
  },

  "fibonacci": {
    java: {
      code: `// Recursive — O(2^n), shows call tree
public static int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// Iterative — O(n) time, O(1) space
public static int fibFast(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}

// Memoized — O(n) time, O(n) space
static Map<Integer, Integer> memo = new HashMap<>();
public static int fibMemo(int n) {
    if (n <= 1) return n;
    return memo.computeIfAbsent(n, k -> fibMemo(k-1) + fibMemo(k-2));
}`,
      note: "The recursive tree has overlapping subproblems — fib(3) is computed multiple times. Memoization caches results to get O(n). The iterative version is fastest and uses constant space.",
    },
    c: {
      code: `#include <string.h>

// Recursive — exponential, educational
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// Iterative — linear time, constant space
int fib_fast(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b; a = b; b = c;
    }
    return b;
}

// Memoized
static int cache[100];
int fib_memo(int n) {
    if (n <= 1) return n;
    if (cache[n]) return cache[n];
    return cache[n] = fib_memo(n-1) + fib_memo(n-2);
}`,
      note: "C uses a static array for memoization — fast but fixed-size. The iterative version is what you'd use in any real application. Note that int overflows for fib(47) — use long long for larger values.",
    },
    python: {
      code: `# Recursive — O(2^n)
def fib(n):
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)

# Iterative — O(n) time, O(1) space
def fib_fast(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

# Memoized with lru_cache — O(n)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_cached(n):
    if n <= 1: return n
    return fib_cached(n - 1) + fib_cached(n - 2)`,
      note: "@lru_cache is Python's built-in memoization decorator — one line transforms the naive recursive version to O(n). Python integers never overflow. The iterative tuple-swap (a, b = b, a+b) is idiomatic and evaluates the right side before assignment.",
    },
  },

  "two-pointers": {
    java: {
      code: `// Finds a pair that sums to target in a sorted array.
public static int[] twoSum(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target)
            return new int[]{left, right};
        else if (sum < target)
            left++;
        else
            right--;
    }
    return new int[]{-1, -1}; // not found
}`,
      note: "The key insight: if the sum is too small, we move left right to increase it; if too large, we move right left to decrease it. This only works because the array is sorted. Returns indices, not values.",
    },
    c: {
      code: `#include <stdio.h>

// Returns 1 if found (sets *lo and *hi), 0 otherwise.
int two_sum(int *arr, int n, int target, int *lo, int *hi) {
    *lo = 0; *hi = n - 1;
    while (*lo < *hi) {
        int sum = arr[*lo] + arr[*hi];
        if      (sum == target) return 1;
        else if (sum < target)  (*lo)++;
        else                    (*hi)--;
    }
    return 0;
}`,
      note: "C can't return two indices cleanly from a function, so output parameters (pointers lo and hi) are used. The return value signals success/failure. This pattern is common in C APIs.",
    },
    python: {
      code: `def two_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return left, right  # Python multiple return
        elif s < target:
            left += 1
        else:
            right -= 1
    return -1, -1  # not found

# Usage:
# lo, hi = two_sum([1, 2, 4, 6, 8], 10)`,
      note: "Python's multiple return makes the API cleaner than C's output-parameter style. Tuple unpacking (lo, hi = two_sum(...)) is idiomatic. The same technique extends to three-sum (two pointers inside a loop).",
    },
  },

  // ── 42 Tirana algorithms ────────────────────────────────────────

  "ft-split": {
    java: {
      code: `import java.util.*;

public static String[] ftSplit(String s, char c) {
    List<String> words = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
        while (i < s.length() && s.charAt(i) == c) i++;
        if (i == s.length()) break;
        int start = i;
        while (i < s.length() && s.charAt(i) != c) i++;
        words.add(s.substring(start, i));
    }
    return words.toArray(new String[0]);
}`,
      note: "Java's String.split() does this in one line, but this manual version mirrors the C logic. ArrayList grows dynamically so we don't need to count words first, unlike the C version.",
    },
    c: {
      code: `#include <stdlib.h>
#include <string.h>

static int count_words(char const *s, char c) {
    int count = 0;
    while (*s) {
        while (*s == c) s++;
        if (*s) { count++; while (*s && *s != c) s++; }
    }
    return count;
}

char **ft_split(char const *s, char c) {
    int   wc  = count_words(s, c);
    char **res = malloc((wc + 1) * sizeof(char *));
    if (!res) return NULL;
    int k = 0;
    while (*s) {
        while (*s == c) s++;
        if (!*s) break;
        char const *start = s;
        while (*s && *s != c) s++;
        int len = s - start;
        res[k] = malloc((len + 1) * sizeof(char));
        if (!res[k]) return NULL;
        ft_memcpy(res[k], start, len);
        res[k++][len] = '\\0';
    }
    res[k] = NULL;
    return res;
}`,
      note: "Two-pass approach: count words first, then malloc the outer array. Each word gets its own malloc'd string. The NULL sentinel at the end is mandatory for libft — callers loop until they hit NULL. Always free both the strings and the array.",
    },
    python: {
      code: `def ft_split(s, c):
    words = []
    i = 0
    while i < len(s):
        while i < len(s) and s[i] == c:
            i += 1
        if i == len(s):
            break
        start = i
        while i < len(s) and s[i] != c:
            i += 1
        words.append(s[start:i])
    return words

# Python one-liner equivalent:
# words = [w for w in s.split(c) if w]`,
      note: "The verbose while-loop version mirrors the C logic exactly. The one-liner is idiomatic Python. Note: Python's split() with a single char delimiter collapses consecutive delimiters, which is exactly the ft_split behavior.",
    },
  },

  "ft-itoa": {
    java: {
      code: `public static String ftItoa(int n) {
    // Handles INT_MIN via long to avoid negation overflow
    long val = (long) n;
    if (val == 0) return "0";
    boolean neg = val < 0;
    if (neg) val = -val;
    StringBuilder sb = new StringBuilder();
    while (val > 0) {
        sb.insert(0, (char)('0' + val % 10));
        val /= 10;
    }
    if (neg) sb.insert(0, '-');
    return sb.toString();
}`,
      note: "Casting to long before negation is the same trick used in the C version — it avoids overflow when n is Integer.MIN_VALUE (-2147483648), whose positive value doesn't fit in an int. insert(0, ...) builds the string in reverse.",
    },
    c: {
      code: `#include <stdlib.h>

char *ft_itoa(int n) {
    long  nb  = (long)n;
    int   len = (nb <= 0) ? 1 : 0; // '-' or '0'
    long  tmp = nb;
    while (tmp) { len++; tmp /= 10; }

    char *str = malloc((len + 1) * sizeof(char));
    if (!str) return NULL;
    str[len] = '\\0';
    if (nb < 0) { str[0] = '-'; nb = -nb; }
    while (len-- > (n < 0 ? 1 : 0)) {
        str[len] = '0' + nb % 10;
        nb /= 10;
    }
    return str;
}`,
      note: "The key insight: fill the string from right to left using modulo 10. Cast to long first so -(INT_MIN) doesn't overflow. The caller owns the returned string and must free() it.",
    },
    python: {
      code: `def ft_itoa(n):
    # Manual implementation — no str() allowed
    if n == 0:
        return "0"
    neg = n < 0
    n   = abs(n)
    digits = []
    while n:
        digits.append(chr(ord('0') + n % 10))
        n //= 10
    if neg:
        digits.append('-')
    return ''.join(reversed(digits))`,
      note: "Python doesn't have INT_MIN overflow — all integers are arbitrary precision. The digit extraction loop (% 10, // 10) is the same algorithm as the C version. In real Python code you'd just use str(n), but this shows the underlying logic.",
    },
  },

  "ft-atoi": {
    java: {
      code: `public static int ftAtoi(String s) {
    int i = 0, sign = 1, result = 0;
    // Skip leading whitespace (space, \\t, \\n, \\r, \\f, \\v)
    while (i < s.length() && " \\t\\n\\r\\f".indexOf(s.charAt(i)) >= 0)
        i++;
    // Optional sign
    if (i < s.length() && (s.charAt(i) == '+' || s.charAt(i) == '-'))
        sign = (s.charAt(i++) == '-') ? -1 : 1;
    // Accumulate digits
    while (i < s.length() && Character.isDigit(s.charAt(i)))
        result = result * 10 + (s.charAt(i++) - '0');
    return sign * result;
}`,
      note: "The three-phase pattern (skip whitespace → read sign → accumulate digits) is identical across all languages. Java's Character.isDigit() handles the digit check cleanly. For overflow handling, compute with long and clamp.",
    },
    c: {
      code: `int ft_atoi(const char *str) {
    int i = 0, sign = 1, result = 0;
    // Skip whitespace: space (32) and \\t\\n\\v\\f\\r (9-13)
    while (str[i] == 32 || (str[i] >= 9 && str[i] <= 13))
        i++;
    // Optional sign
    if (str[i] == '-' || str[i] == '+')
        sign = (str[i++] == '-') ? -1 : 1;
    // Accumulate digits
    while (str[i] >= '0' && str[i] <= '9')
        result = result * 10 + (str[i++] - '0');
    return (sign * result);
}`,
      note: "The whitespace check uses ASCII values directly (32 = space, 9–13 = tab/newline/vertical-tab/form-feed/carriage-return). Digits are detected as chars in range '0'–'9', which is idiomatic C. No stdlib needed.",
    },
    python: {
      code: `def ft_atoi(s):
    i, sign, result = 0, 1, 0
    # Skip whitespace
    while i < len(s) and s[i] in ' \\t\\n\\r\\f\\v':
        i += 1
    # Optional sign
    if i < len(s) and s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    # Accumulate digits
    while i < len(s) and s[i].isdigit():
        result = result * 10 + int(s[i])
        i += 1
    return sign * result`,
      note: "The logic is a direct translation of the C version. s[i].isdigit() is cleaner than checking ASCII range. Python's int() never overflows — the C version silently wraps on overflow, which is undefined behavior.",
    },
  },

  "ft-union": {
    java: {
      code: `public static String ftUnion(String s1, String s2) {
    boolean[] seen = new boolean[256];
    StringBuilder out = new StringBuilder();
    for (String s : new String[]{s1, s2}) {
        for (char c : s.toCharArray()) {
            if (!seen[(int) c]) {
                seen[(int) c] = true;
                out.append(c);
            }
        }
    }
    return out.toString();
}`,
      note: "The seen[256] array acts as a hash set for ASCII chars, giving O(1) lookup. Iterating s1 then s2 in order ensures first-appearance ordering. Java's char is 16-bit Unicode — cast to int for the index.",
    },
    c: {
      code: `#include <unistd.h>

void ft_union(char *s1, char *s2) {
    char seen[256];
    int  i = 0;
    ft_memset(seen, 0, 256);
    while (s1[i]) {
        if (!seen[(unsigned char)s1[i]]) {
            seen[(unsigned char)s1[i]] = 1;
            write(1, &s1[i], 1);
        }
        i++;
    }
    i = 0;
    while (s2[i]) {
        if (!seen[(unsigned char)s2[i]]) {
            seen[(unsigned char)s2[i]] = 1;
            write(1, &s2[i], 1);
        }
        i++;
    }
    write(1, "\\n", 1);
}`,
      note: "Cast to unsigned char before using as index — plain char can be negative on some platforms, causing undefined array access. write() outputs one character at a time directly to stdout (fd 1). No printf allowed in 42 exams.",
    },
    python: {
      code: `def ft_union(s1, s2):
    seen   = set()
    result = []
    for c in s1 + s2:
        if c not in seen:
            seen.add(c)
            result.append(c)
    print(''.join(result))

# Equivalent one-liner:
# print(''.join(dict.fromkeys(s1 + s2)))`,
      note: "Python sets give O(1) membership. dict.fromkeys() is a compact trick: dicts preserve insertion order since Python 3.7, so it deduplicates while maintaining first-appearance order — the exact ft_union semantics.",
    },
  },

  "ft-inter": {
    java: {
      code: `public static String ftInter(String s1, String s2) {
    boolean[] inS2   = new boolean[256];
    boolean[] printed = new boolean[256];
    StringBuilder out = new StringBuilder();
    // Pass 1: mark every char that appears in s2
    for (char c : s2.toCharArray())
        inS2[(int) c] = true;
    // Pass 2: output chars from s1 that are in s2 (once each)
    for (char c : s1.toCharArray()) {
        if (inS2[(int) c] && !printed[(int) c]) {
            printed[(int) c] = true;
            out.append(c);
        }
    }
    return out.toString();
}`,
      note: "Two boolean arrays instead of one: inS2 tracks which chars appear in s2, printed prevents duplicates in output. The two-pass approach is O(n). Alternatively, a Set intersection with ordered iteration from s1 works.",
    },
    c: {
      code: `#include <unistd.h>

void ft_inter(char *s1, char *s2) {
    char map[256] = {0};
    int  i = 0;
    // Pass 1: mark chars in s2 with value 1
    while (s2[i])
        map[(unsigned char)s2[i++]] = 1;
    // Pass 2: if char in s1 is marked 1, print and mark 2
    i = 0;
    while (s1[i]) {
        if (map[(unsigned char)s1[i]] == 1) {
            map[(unsigned char)s1[i]] = 2;
            write(1, &s1[i], 1);
        }
        i++;
    }
    write(1, "\\n", 1);
}`,
      note: "Elegant trick: value 1 = 'seen in s2', value 2 = 'already printed'. This avoids a second boolean array. The order of output follows s1. This is the classic 42 Rank 02 exam pattern — learn it by heart.",
    },
    python: {
      code: `def ft_inter(s1, s2):
    in_s2  = set(s2)
    seen   = set()
    result = []
    for c in s1:
        if c in in_s2 and c not in seen:
            seen.add(c)
            result.append(c)
    print(''.join(result))

# Compact version preserving s1 order:
# s2_set = set(s2)
# print(''.join(dict.fromkeys(c for c in s1 if c in s2_set)))`,
      note: "Two sets mirror the two-array C approach. dict.fromkeys with a generator is O(n) and handles deduplication. Output preserves the order characters first appear in s1, which is the correct ft_inter behavior.",
    },
  },

  "last-word": {
    java: {
      code: `public static void lastWord(String s) {
    int i = s.length() - 1;
    // Skip trailing spaces
    while (i >= 0 && s.charAt(i) == ' ') i--;
    int end = i;
    // Walk back to the start of the last word
    while (i >= 0 && s.charAt(i) != ' ') i--;
    // i+1 to end+1 is the last word
    System.out.println(s.substring(i + 1, end + 1));
}

// One-liner with Java:
// String[] parts = s.strip().split("\\\\s+");
// System.out.println(parts[parts.length - 1]);`,
      note: "Manual backwards scan mirrors the C approach. i ends one position before the word starts, so i+1 is correct. The one-liner is idiomatic Java but split() would need to handle all-space input gracefully.",
    },
    c: {
      code: `#include <unistd.h>

void last_word(char *s) {
    int i = 0;
    while (s[i]) i++;  // find end
    i--;
    while (i >= 0 && s[i] == ' ') i--;  // skip trailing spaces
    int end = i;
    while (i >= 0 && s[i] != ' ') i--;  // find word start
    // print chars from i+1 to end (inclusive)
    while (++i <= end)
        write(1, &s[i], 1);
    write(1, "\\n", 1);
}`,
      note: "Classic backwards scan: skip trailing whitespace, then walk back through the word. The tricky ++i in the final while puts i at the word's first character before printing starts. No stdlib, no printf — just write().",
    },
    python: {
      code: `def last_word(s):
    # Manual approach (mirrors C logic):
    i = len(s) - 1
    while i >= 0 and s[i] == ' ':
        i -= 1
    end = i
    while i >= 0 and s[i] != ' ':
        i -= 1
    print(s[i + 1 : end + 1])

# Pythonic one-liner:
# print(s.rstrip().split()[-1])`,
      note: "rstrip() removes trailing whitespace, split() without arguments splits on any whitespace and handles multiple consecutive spaces. Both versions handle edge cases like all-spaces input — rstrip().split() returns [] which would IndexError, so add a guard if needed.",
    },
  },
};
