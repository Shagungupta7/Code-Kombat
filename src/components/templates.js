export const STARTER_TEMPLATES = {
  javascript: `// Write your code here
function main() {
    const input = require('fs').readFileSync(0, 'utf-8').trim();
    // Process input
    console.log(input);
}
main();`,

  python: `# Write your code here
def main():
    n = input().strip()
    print(n)

if __name__ == "__main__":
    main()`,

  java: `import java.util.*;
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input
        int n = sc.nextInt();
        // Process and print
        System.out.println(n);
    }
}`,

  c: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    printf("%d", n);
    return 0;
}`,

  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n;
    return 0;
}`
};
