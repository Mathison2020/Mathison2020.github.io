---
title: "基础算法模版"
published: 2023-07-28
description: "基础算法模板 雄关漫道真如铁，而今迈步从头越 1 基础算法1.1 归并排序稳定的排序，很好敲（比起快排我更喜欢归并） 应用：求逆序对 void msort(int a[],int l,int r) { if(l>=r) return; int mid=(l+r)>>1; msort(a,l,mid); msort(a,"
image: "api"
tags: ["算法", "模板"]
category: "算法"
draft: false
lang: zh-CN
comment: true
---
# 基础算法模板

> 雄关漫道真如铁，而今迈步从头越

## 1 基础算法

### 1.1 归并排序

稳定的排序，很好敲（比起快排我更喜欢归并）

应用：求逆序对

> [!NOTE]
> **模板速记**
>
> - 核心思想：分治后合并两个有序区间
> - 时间复杂度：$O(n\log n)$
> - 常见扩展：合并时统计逆序对贡献

```cpp nocollapse
void msort(int a[],int l,int r) {
    if(l>=r) return;
    int mid=(l+r)>>1;
    msort(a,l,mid);
    msort(a,mid+1,r);
    int i=l,j=mid+1,k=l;
    while(i<=mid&&j<=r) b[k++]=(a[i]>a[j])?a[j++]:a[i++];
    while(i<=mid) b[k++]=a[i++];
    while(j<=r) b[k++]=a[j++];
    for(int i=l;i<=r;i++) a[i]=b[i];
    return;
}
```

### 1.2 快速排序

~~应用？有什么应用呢？~~

```cpp nocollapse
void qsort(int a[],int l,int r) {
    if(l>=r) return;
    int i=l-1,j=r+1,x=a[l+r>>1];
    while(i<j) {
        do i++; while(a[i]<x);
        do j--; while(a[j]>x);
        if(i<j) swap(a[i],a[j]);
    }
    qsort(a,l,j);
    qsort(a,j+1,r);
}
```

### 1.3 二分

吕优学长的稳健的二分模板

应用：二分答案，适用于**单调**的问题，通常是二分答案后进行贪心可行性验证。

> [!TIP]
> 二分最容易错的不是模板，而是 `check(mid)` 的方向。写模板前先确定答案区间中“可行/不可行”的分界线。

*   整数

```cpp nocollapse
int bsch(int L,int R) {
    int ans=L;
	while(L<=R) {
        int mid=(L+R)>>1;
        if(check(mid)) ans=mid,L=mid+1;
        else R=mid-1; //可根据题意与上句交换
    }
    return ans;
}
```

*   浮点数

```cpp nocollapse
const double eps=1e-6;
double bfsch(int L,int R) {
	while(R-L>eps) {
        double mid=(L+R)/2;
        if(check(mid)) L=mid;
        else R=mid; //可根据题意与上句交换
    }
    return L;
}
```

### 1.4 前缀和 & 差分

前缀和：离线问题，单点修改 -> 区间查询

*   一维前缀和：
    *   记录：`s[i]=s[i-1]+a[i]`
    *   查询`[l,r]`：`s[r]-s[l-1]`
*   二维前缀和：
    *   记录：`s[i][j]=s[i-1][j]+s[i][j-1]-s[i-1][j-1]+a[i][j]`
    *   查询`[(x1,y1),(x2,y2)]`：`s[x2][y2]-s[x1-1][y2]-s[x2][y1-1]+s[x1-1][y1-1]`

差分：离线问题，区间修改 -> 单点查询

*   一维差分：
    
    *   区间`[l,r]`修改：`d[l]+=k, d[r+1]-=k`
    *   计算前缀和：`d[i]+=d[i-1]`
*   二维差分：
    
    *   区间`[(x1,y1),(x2,y2)]`修改：`d[x1][y1]+=k, d[x2+1][y1]-=k, d[x1][y2+1]-=k, d[x2+1][y2+1]+=k`
    *   计算前缀和：`d[i][j]+=d[i-1][j]+d[i][j-1]-d[i-1][j-1]`

### 1.5 有序数组定位

#### 1.5.1 lower\_bound & upper\_bound

*   函数原型：

```cpp nocollapse
typedef ForwardIterator FI;
// 在[first,last)区域内查找不小于 val 的元素
FI lower_bound(FI first, FI last, const T& val);
// 在[first,last)区域内查找第一个不符合 cmp 规则的元素
FI lower_bound(FI first, FI last, const T& val, Compare cmp);
// 在[first,last)区域内查找第一个大于 val 的元素。
FI upper_bound(FI first, FI last, const T& val);
// 在[first,last)区域内查找第一个不符合 cmp 规则的元素
FI upper_bound(FI first, FI last, const T& val, Compare cmp);
// 在[first,last)区域内查找所有等于 val 的元素
pair<FI,FI> equal_range (FI first, FI last, const T& val[, Compare cmp]);
```

*   应用举例：

```cpp nocollapse
//vector<int>
sort(v.begin(),v.end());
lower_bound(v.begin(),v.end(),x)-v.begin(); 	// 第一个大于等于x的元素位置
upper_bound(v.begin(),v.end(),x)-v.begin(); 	// 第一个大于x的元素位置
lower_bound(v.begin(),v.end(),x)-v.begin()-1; 	// 最后一个小于x的元素位置
upper_bound(v.begin(),v.end(),x)-v.begin()-1; 	// 最后一个小于等于x的元素位置

sort(v.begin(),v.end(),greater<int>());
lower_bound(v.begin(),v.end(),x,greater<int>())-v.begin(); 		// 第一个小于等于x的元素位置
upper_bound(v.begin(),v.end(),x,greater<int>())-v.begin(); 		// 第一个小于x的元素位置
lower_bound(v.begin(),v.end(),x,greater<int>())-v.begin()-1; 	// 最后一个大于x的元素位置
upper_bound(v.begin(),v.end(),x,greater<int>())-v.begin()-1; 	// 最后一个大于等于x的元素位置

//数组
sort(a,a+n);
lower_bound(a,a+n,x)-a; 	// 第一个大于等于x的元素位置
upper_bound(a,a+n,x)-a; 	// 第一个大于x的元素位置
lower_bound(a,a+n,x)-a-1; 	// 最后一个小于x的元素位置
upper_bound(a,a+n,x)-a-1; 	// 最后一个小于等于x的元素位置

bool cmp(int a,int b) {return a>b;}
sort(a,a+n,cmp);
lower_bound(a,a+n,x,cmp)-a; 	// 第一个小于等于x的元素位置
upper_bound(a,a+n,x,cmp)-a; 	// 第一个小于x的元素位置
lower_bound(a,a+n,x,cmp)-a-1; 	// 最后一个大于x的元素位置
upper_bound(a,a+n,x,cmp)-a-1; 	// 最后一个大于等于x的元素位置
```

**【例题】**

给定一个按照升序排列的长度为 $n$ 的整数数组，以及 $m$ 个查询。

对于每个查询，返回一个元素 $x$ 的起始位置和终止位置（位置从 `0` 开始计数）。

如果数组中不存在该元素，则返回 `-1 -1`。

*   法一：二分

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
int n,m,a[N];
int SL(int x) { //左界
    int l=0,r=n-1,ret=1e9+7;
    while(l<=r) {
        int mid=l+r>>1;
        if(a[mid]>=x) ret=min(ret,mid),r=mid-1; 
        else l=mid+1; 
    }   
    return ret;
}
int SR(int x) { //右界
    int l=0,r=n-1,ret=-1;
    while(l<=r) {                   
        int mid=l+r>>1;
        if(a[mid]<=x) ret=max(ret,mid),l=mid+1;
        else r=mid-1; 
    }
    return r; 
}
int main() {
    scanf("%d%d",&n,&m);
    for(int k=0;k<n;k++) scanf("%d",a+k);
    while(m--) {
        int x;
        scanf("%d",&x);
        int L=SL(x),R=SR(x);
        if(a[L]==x) printf("%d %d\n",L,R);
        else printf("-1 -1\n");
    }
    return 0;
}
```

*   法二：lowerbound & upperbound 定位

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m,a[100010];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d",a+i);
    while(m--) {
        int l,r,x;
        scanf("%d",&x);
        l=lower_bound(a+1,a+n+1,x)-a;
        r=upper_bound(a+1,a+n+1,x)-a-1;
        if(l>r) l=r=0;
        printf("%d %d\n",l-1,r-1);
    }
    return 0;
}
```

#### 1.5.2 离散化

不改变数据**相对大小**的前提下将稀疏的数据映射为连续的数据后存储。

**【例题】**

*   $n$ 个修改：`x c`：`a[x]+=c`
*   $m$ 个查询：`l r`：查询 $\sum_{[l,r]}a_i$
*   $1≤n,m≤10^5,\\ −10^9≤x≤10^9,\\ −10^9≤l≤r≤10^9,$

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e5+10;
int n,m,s[N];
vector<pair<int,int> > a;
vector<int> q;
int main() {
    scanf("%d%d",&n,&m);
    while(n--) {
        int x,c;
        scanf("%d%d",&x,&c);
        a.push_back({x,c});
        q.push_back(x);
    }
    q.push_back(-0x3f3f3f); q.push_back(0x3f3f3f);		// 前后界防越界【养成好习惯】
    sort(q.begin(),q.end());							// 排序
    q.erase(unique(q.begin(),q.end()),q.end());			// 去重【记住这个用法！】
    for(auto p:a) {
        int i=lower_bound(q.begin(),q.end(),p.first)-q.begin();
        s[i]+=p.second;
    }
    for(int i=1;i<q.size();i++) s[i]+=s[i-1];

    while(m--) {
        int l,r;
        scanf("%d%d",&l,&r);
        l=lower_bound(q.begin(),q.end(),l)-q.begin();		// l:第一个大于等于l的位置
        r=upper_bound(q.begin(),q.end(),r)-q.begin()-1;		// r:最后一个小于等于r的位置
        printf("%d\n",s[r]-s[l-1]);
    }
}
```

### 1.6 位运算

#### 1.6.1 数字二进制位数

```cpp nocollapse
int len(int x) {	//十进制同理
    int ret=0;
    do ret++,x>>=1; while(x);
    return ret;
}
```

#### 1.6.2 数字二进制中’1’的个数

```cpp nocollapse
int lowbit(int x) {return x&-x;}
int count1(int x) {
    int ret=0;
    while(x) ret++,x-=lowbit(x);
    return ret;
}
```

#### 1.6.3 二进制枚举

```cpp nocollapse
for(int i=0;i<1<<n;i++) { 		// 枚举n位01串
    for(int j=0;j<n;j++) {	
        if(check(i>>j&1)) {		// 检验i的第j位数字
            /* … */
        } 
    }
}
```

### 1.7 高精度

[高精度运算合集](https://www.luogu.com.cn/blog/virus2017/post-gao-jing-du-ji-suan-gao-jing-du-mu-ban-tai-quan)

### 1.8 KMP

*   nxt数组的含义：`nxt[i]` 表示 `b[0~i-1]` **最长公共前后缀**长度（不包括本身）

```cpp nocollapse
char a[N],b[N]; //b[]为模式串
int lena,lenb,nxt[N];
void pre() {
    for(int i=1,j=0;i<lenb;i++) {
        while(j&&b[i]!=b[j]) j=nxt[j];
        if(b[i]==b[j]) j++;
        nxt[i+1]=j;	// nxt[i+1]对应b[i]
    }
}
void kmp() {
    for(int i=0,j=0;i<lena;i++) {
        while(j&&a[i]!=b[j]) j=nxt[j];
        if(a[i]==b[j]) j++;
        if(j==lenb) printf("%d\n",i+1-lenb+1); // 匹配位置
    }
}
```

### 1.9 Hash

#### 1.9.1 拉链法

```cpp nocollapse
const int N=1e6+3;
int h[N],e[N],nxt[N],tot;
void insert(int k) {
    int x=(k%N+N)%N;
    e[++tot]=k;
    nxt[tot]=h[x];
    h[x]=tot;
}
bool find(int k) {
    int x=(k%N+N)%N;
    for(int i=h[x];i;i=nxt[i])
        if(e[i]==k) return 1;
    return 0;
}
```

#### 1.9.2 开放寻址法（线性探查法）

```cpp nocollapse
const int N=1e6+3;
int h[N]={-1};

int find(int k) { // 若k在哈希表中，返回k的下标；否则返回k应该插入的位置
	int x=(k%N+N)%N;
    while(h[x]!=-1&&h[x]!=k)  (x+=1)%=N;
	return x;
}
```

#### 1.9.3 字符串Hash

*   ELFHash

```cpp nocollapse
unsigned ELFHash(const char *str) {
	unsigned h=0,g;
	while(*str) {
		h=(h<<4)+*str++;
		if(g=h&0xf0000000) h^=g>>24;
		h&=~g;
	}
	return h;
}
```

### 1.10 快速乘 快速幂

```cpp nocollapse
ll ksc(ll a,ll k) { // 快速乘
    ll ret=0;
    for(;k;(a<<=1)%=mod,k>>=1) if(k&1) (ret+=a)%=mod;
    return ret;
}
ll ksm(ll a,ll k) {	// 快速幂
    ll ret=1;
    for(;k;(a*=a)%=mod,k>>=1) if(k&1) (ret*=a)%=mod;
    return ret;
}
```

## 2 基础数据结构

### 2.1 单链表

```cpp nocollapse
int head,e[N],nxt[N],tot;
void insert(int x) { // 头插法
    e[tot]=x,
    nxt[tot]=head,
    head=tot;
}
void remove() {	// 将头结点删除，需要保证头结点存在
    head = nxt[head];
}
```

【例】实现单链表及其操作：

1.  `H x`，表示向链表头插入一个数 $x$。
2.  `D k`，表示删除第 $k$ 个插入的数后面的数（当 $k$ 为 $0$ 时，表示删除头结点）。
3.  `I k x`，表示在第 $k$ 个插入的数后面插入一个数 $x$（此操作中 $k$ 均大于 $0$）。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
int m,k,x;
int e[N],nxt[N],head,tot;
void insert(int i,int x) {
    e[++tot]=x;
    if(!i) nxt[tot]=head, head=tot;
    else nxt[tot]=nxt[i], nxt[i]=tot;
}
void remove(int i) {
    if(!i) head=nxt[head];
    else nxt[i]=nxt[nxt[i]];
}
int main() {
    scanf("%d",&m);
    while(m--) {
        char c[1];
        scanf("%s",c);
        if(c[0]=='H') { scanf("%d",&x); insert(0,x); }
        else if(c[0]=='D') { scanf("%d",&k); remove(k); }
        else if(c[0]=='I') { scanf("%d%d",&k,&x); insert(k,x); }
    }
    for(int i=head;i;i=nxt[i]) printf("%d ",e[i]);
    return 0;
}
```

### 2.2 双链表

```cpp nocollapse
int e[N],l[N],r[N],tot;
const R=N-1;
void init() {	// 初始化
    r[0]=R,l[R]=0;
}
void insert(int k, int w) {	// 在节点k的右边插入一个数w
    e[++tot]=x;
    l[tot]=k,r[tot]=r[k];
    l[r[k]]=tot,r[k]=tot;
}
void remove(int k) {	// 删除节点k
    l[r[k]]=l[k];
    r[l[k]]=r[k];
}
```

【例】实现双链表及其操作：

1.  `L x`，表示在链表的最左端插入数 $x$。
2.  `R x`，表示在链表的最右端插入数 $x$。
3.  `D k`，表示将第 $k$ 个插入的数删除。
4.  `IL k x`，表示在第 $k$ 个插入的数左侧插入一个数。
5.  `IR k x`，表示在第 $k$ 个插入的数右侧插入一个数。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100011;
const int R=N-10;
int m,e[N],l[N],r[N],tot;
void insert(int k,int x) {
    e[++tot]=x;
    l[tot]=k,r[tot]=r[k];
    l[r[k]]=tot,r[k]=tot;
}
void remove(int k) {
    l[r[k]]=l[k];
    r[l[k]]=r[k];
}
int main() {
    scanf("%d",&m);
    r[0]=R,l[R]=0;
    while(m--) {
        int k,x;
        string c;
        cin>>c;
        if(c=="L") { scanf("%d",&x); insert(0,x); }
        else if(c=="R") { scanf("%d",&x); insert(l[R],x); } 
        else if(c=="D") { scanf("%d",&k); remove(k); }
        else if(c=="IL") { scanf("%d%d",&k,&x); insert(l[k],x); }
        else { scanf("%d%d",&k,&x); insert(k,x); }
    }
    for(int i=r[0];i!=R;i=r[i]) printf("%d ",e[i]);
    return 0;
}
```

### 2.3 栈

#### 2.3.1 模拟栈

```cpp nocollapse
int st[N],t=0;
bool empty() { return !t; }
int size() { return t; }
void push(int x) { st[++t]=x; }
int pop() {
    if(empty()) return -1;
    return st[t--];
}
int top() {
    if(empty()) return -1;
    return st[t];
}
void clear() { t=0; }
```

#### 2.3.2 STL stack

```cpp nocollapse
stack<int> s;
s.empty();	// 是否为空
s.size();	// 返回元素个数
s.top();	// 返回栈顶元素
s.push(x);	// 压入x
s.pop();	// 弹出栈顶（注意STL容器的pop是动作，无返回值）
s.clear(); 	// 不存在！
stack<int>().swap(s); // 等同于所谓's.clear()'
```

#### 2.3.3\* 单调栈

适用问题：找出每个数**两侧离它最近**的比它大/小的数

```cpp nocollapse
while(!s.empty()&&check(s.top(),i)) s.pop();
s.push(i);
```

【例】接雨水

给定 $n$ 个非负整数表示每个宽度为 $1$ 的柱子的高度图。

计算按此排列的柱子，下雨之后能接多少雨水。

![接雨水-示意图](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/10/22/rainwatertrap.png)

*   法一：单调栈

```cpp nocollapse
int ans=0,n=h.size();
stack<int> s;
for(int i=0;i<n;i++) {
    while(!s.empty()&&h[i]>h[s.top()]) {
        int t=s.top(); s.pop();
        if(s.empty()) break;
        int j=s.top();
        ans+=(i-j-1)*(min(h[j],h[i])-h[t]);
    }
    s.push(i);
}
printf("%d",ans);
```

*   法二：dp

```cpp nocollapse
const int N=2e4+10;
int ans=0,n=h.size();
int lm[N]={0},rm[N]={0};
for(int i=1;i<=n;i++) {
    lm[i]=max(lm[i-1],h[i-1]);
	rm[n-i+1]=max(rm[n-i+2],h[n-i]);
}
for(int i=1;i<=n;i++) ans+=min(lm[i],rm[i])-h[i-1];
printf("%d",ans);
```

*   法三：双指针

```cpp nocollapse
int i=0,j=h.size()-1,ans=0;
int l=h[i],r=h[j];
while(i<j) {
    if(h[i]<h[j]) 
        ans+=l-h[i++],l=max(l,h[i]);
    else 
        ans+=r-h[j--],r=max(r,h[j]);
}
printf("%d",ans);
```

### 2.4 队列

#### 2.4.1 模拟队列

*   普通队列（t=-1写法）

```cpp nocollapse
int q[N],h=0,t=-1;
bool empty() { return t<h; }
int size() { return t-h+1; }
void push(int x) { q[++t]=x; }
int pop() {
    if(empty()) return -1;
    return q[h++];
}
int front() {
    if(empty()) return -1;
    return q[h];
}
void clear() { h=0,t=-1; }
```

*   循环队列

```cpp nocollapse
int q[N],h=0,t=0;
bool empty() { return h==t; }
int size() { return (t+N-h)%N; }
void push(int x) { 
    q[t++]=x; 
    if(t==N) t=0;
}
int pop() {
    if(empty()) return -1;
    int ret=q[h++];
    if(h==N) h=0;
    return ret;
}
int front() {
    if(empty()) return -1;
    return q[h];
}
void clear() { h=t=0; }
```

*   双端队列

```cpp nocollapse
int dq[N<<1],h=N,t=N-1;
bool empty() { return t<h; }
int size() { return t-h+1; }
void push_front(int x) { dq[--h]=x; }
void push_back(int x) { dq[++t]=x; }
int pop_front() {
    if(empty()) return -1;
    return dq[h++];
}
int pop_back() {
    if(empty()) return -1;
    return dq[t--];
}
int front() {
    if(empty()) return -1;
    return q[h];
}
int back() {
    if(empty()) return -1;
    return q[t];
}
int clear() { h=N,t=N-1; }
```

#### 2.4.2 STL queue/deque

```cpp nocollapse
queue<int> q;
q.empty();	// 是否为空
q.size();	// 返回元素个数
q.front();	// 返回栈顶元素
q.push(x);	// 入队x
q.pop();	// 队首出队（注意STL容器的pop是动作，无返回值）
q.clear(); 	// 不存在！
queue<int>().swap(q); // 等同于所谓'q.clear()'

deque<int> dq;	// 双端队列
dq.empty();
dq.size();
dq.front();	dq.back();
dq.push_front(); dq.push_back();
dq.pop_front(); dq.pop_back();
deque<int>().swap(dq);
```

#### 2.4.3 单调队列

本质：如果一个选手**比你小**还**比你强**，你就可以退役了。

应用：滑动窗口问题，区间最值问题，单调队列优化dp

```cpp nocollapse
while(!dq.empty()&&check_out(dq.front()) dq.pop_front();
while(!dq.empty()&&check_in(dq.back(),i)) dq.pop_back();
dq.push_back(i);
```

【例题】长度不超过 $k$ 的最大连续子区间和

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
int n,k,a[N],s[N],ans=-0x3f3f3f;
deque<int> q;
int main() {
    scanf("%d%d",&n,&k);
    for(int i=1;i<=n;i++) scanf("%d",s+i),s[i]+=s[i-1];
    q.pop_back(0);
    for(int i=1;i<=n;i++) {
        while(!q.empty()&&i-q.front()>k) q.pop_front();
        while(!q.empty()&&s[q.back()]>s[i]) q.pop_back();
        q.push_back(i);
        ans=max(ans,s[i]-s[q.front()]);
    }
    printf("%d",ans);
}
```

#### 2.4.4 优先队列

```cpp nocollapse
priority_queue<int> q;	// 大根堆
priority_queue<int,vector<int>,greater<int> > q2;	// 小根堆
q.top();	// 队头
q.empty(); 	// 是否为空
q.size(); 	// 返回元素个数
q.pop();	// 队头出队
priority_queue<int>().swap(q);	// q.clear()
```

应用详见 **2.5.2 STL priority\_queue**

### 2.5 堆

#### 2.5.1 模拟堆

```cpp nocollapse
// h[N]存储堆中的值, h[1]是堆顶
int h[N],tot;
void down(int x) {	// 下沉
    int t=x;
    if((x<<1)<=n && h[x<<1]<h[t]) t=x<<1;
    if((x<<1|1)<=n && h[x<<1|1]<h[t]) t=x<<1|1;
    if(x!=t) swap(h[x],h[t]),down(t);
}
void up(int x) {	// 上浮
    while((x>>1)&&h[x]<h[x>>1]) {
        swap(h[x],h[x>>1]);
        x>>=1;
    }
}
void init() {	// 重整堆
    for(int i=tot>>1;i;i--) down(i);
}
int top() { return h[1]; }
void push(int x) {	// 压入堆
    h[++tot]=x;
    up(tot);
}
int pop() {		// 弹出堆顶
    if(!tot) return -1;
    int ret=h[1];
    h[1]=h[tot--];
    down(1);
    return ret;
}
void clear() { tot=0; }
```

#### 2.5.2 STL priority\_queue

详细定义见 **2.4.4 优先队列**

应用：堆排序，Dijkstra，Prim

#### 2.5.3 堆排序

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
int n,m,h[N];
void down(int x) {
    int t=x;
    if((x<<1)<=n&&h[x<<1]<h[t]) t=x<<1;
    if((x<<1|1)<=n&&h[x<<1|1]<h[t]) t=x<<1|1;
    if(x^t) swap(h[x],h[t]),down(t);
}
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d",h+i);
    for(int i=n>>1;i;i--) down(i);
    while(m--) printf("%d ",h[1]),h[1]=h[n--],down(1);
    return 0;
}
```

### 2.6 并查集

*   初始化与合并操作

```cpp nocollapse
void init() {
    for(int i=1;i<N;i++) fa[i]=i /*,size[i]=1,d[i]=0*/;
}
void Union(int x,int y) {
    int a=find(x),b=find(y);
    // size[b]+=size[a]	// 同时维护并查集规模
    fa[a]=b;
}
```

*   朴素并查集

```cpp nocollapse
int find(int x) {
    while(fa[x]) x=fa[x];
    retun x;
}
```

*   带路径压缩

```cpp nocollapse
int find(int x) {
    return x==fa[x]?x:(fa[x]=find(fa[x]));
}
```

*   按秩合并（没什么用）
    
*   路径压缩的同时保留到祖宗节点的距离信息
    

```cpp nocollapse
int find(int x) {
    if(x==fa[x]) return x;
    else {
		int p=find(fa[x]);
        d[x]+=d[fa[x]];
        fa[x]=p;
    }
	return fa[x];
}
void init() {
    for(int i=1;i<N;i++) fa[i]=i,d[i]=0;
}
void Union(int x,int y) {
    int a=find(x),b=find(y);
    fa[a]=b;
    d[a]=1;
}
```

### 2.7 邻接表（前向星）

```cpp nocollapse
const int N=1010;
const int M=N*N<<1;
int head[N],tot;
int edg[M],ver[M],nxt[M];
void add(int x,int y,int z) {
    ver[++tot]=y;
    edg[tot]=z;
    nxt[tot]=head[x];
    head[x]=tot;
}
// 遍历
void dfs(int x) {
	for(int i=head[x];i;i=nxt[i]) {
    	int y=ver[i],z=edg[i];
      	/* */
    }
}
```

也有vector写法：

```cpp nocollapse
const int N=1010;
vector<pair<int,int> > e[N];
void add(int x,int y,int z) { 
    e[x].push({y,z}); 
}
void dfs(int x) {
	for(auto i:e[x]) {
        int y=i.first,z=i.second;
        /* */
    }
}
```

### 2.8 Trie字典树

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010,M=1<<7;
int m,t[N][M],cnt[N],tot;
char opt[1],s[N];
int Insert() {
    int p=0;
    for(int i=0;s[i];i++) {
        int idx=s[i]-'a';
        if(!t[p][idx]) t[p][idx]=++tot;
        p=t[p][idx];
    }
    return cnt[p]++;
}
int Query() {
    int p=0;
    for(int i=0;s[i];i++) {
        int idx=s[i]-'a';
        p=t[p][idx];
        if(!p) return 0;
    }
    return cnt[p];
}
int main() {
    scanf("%d",&m);
    while(m--) {
        scanf("%s%s",opt,s);
        switch(opt[0]) {
            case 'I': Insert();break;
            case 'Q': printf("%d\n",Query());break;
        }
    }
}
```

### 2.9 哈夫曼树（Huffman）

> 下面先放个运用Huffman树思想的例子

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,ans,t;
priority_queue<int,vector<int>,greater<int> > q;

int main() {
    scanf("%d",&n);
    for(int i=0;i<n;i++) {
        scanf("%d",&t);
        q.push(t);
    }
    for(int i=1;i<n;i++) {
        int a=q.top(); q.pop();
        int b=q.top(); q.pop();
        ans+=a+b; q.push(a+b);
    }
    printf("%d",ans);
}
```

### 2.10\* ST表

RMQ (Range Maximum/Minimum Query) 问题，即区间最值问题

ST表（Sparse Table）解决离线查询区间最值

> [!NOTE]
> **适用场景**
>
> - 静态数组，多次区间最值查询
> - 预处理 $O(n\log n)$，查询 $O(1)$
> - 不支持在线修改，若有修改通常考虑线段树

定义 $f(i,j)$ 为以**第 $i$ 个数为起点**，**长度为 $2^j$** 的一段区间中的最大值，则显然状态转移为

$$  
f(i,j)=\max{( f(i,j-1),f(i+2^{j-1},j-1))) }  
$$  
查询同理，只需查询两段（两段中间可能有重叠部分）

```cpp nocollapse
void pre(int n) {
    int t=log2(n)+1;
    for(int j=1;j<t;j++)
        for(int i=1;i<=n-(1<<j)+1;i++)
            f[i][j]=max(f[i][j-1],f[i+(1<<(j-1))][j-1]);
}
int query(int l,int r) {
    int k=log2(r-l+1);
    return max(f[l][k],f[r-(1<<k)+1][k]);
}
int main() {
    scanf("%d%d",&n,&m); 
    for(int i=1;i<=n;i++) scanf("%d",&f[i][0]);
    pre(n);
    while(m--) {
        int l,r;
        scanf("%d%d",&l,&r); 
        printf("%d\n",query(l,r));
    }
    return 0;
} 
```

## 3 基础搜索

### 3.1 DFS

*   全排列（搜索回溯）

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1<<5;
int n,reg[N],vis[N];
void print() {
    for(int i=1;i<=n;i++) printf("%d ",reg[i]);
    printf("\n");
}
void dfs(int x) {
    if(x>n) { print();return; }
    for(int i=1;i<=n;i++)
        if(!vis[i]) {
            vis[i]=1,reg[x]=i;
            dfs(x+1);
            vis[i]=0;
        }
}
int main() {
    scanf("%d",&n);
    dfs(1);
}
```

*   八皇后

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=10;
int n,reg[N];
bool row[N],le1[N],le2[N<<1];
void print() {
    for(int i=1;i<=n;i++,puts(""))
        for(int j=1;j<=n;j++)
            printf("%c",reg[i]==j?'Q':'.');
    puts("");
}
void dfs(int i) {
    if(i>n) { print();return; }
    for(int j=1;j<=n;j++) {
        if(row[j]||le1[i-j+n]||le2[i+j]) continue;
        reg[i]=j;
        row[j]=le1[i-j+n]=le2[i+j]=1;
        dfs(i+1);
        row[j]=le1[i-j+n]=le2[i+j]=0;
    }
}
int main() {
    scanf("%d",&n);
    dfs(1);
}
```

### 3.2 BFS

*   迷宫问题

平面的遍历一般使用方向向量（注意是四联通还是八联通）

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=110;

// 四联通方向向量
const int dx[4]={0,0,1,-1};	
const int dy[4]={1,-1,0,0};

int n,m,mp[N][N],dis[N][N];
queue<pair<int,int> > q;

//判断边界
bool inBound(int x,int y) { return x>0&&x<=n&&y>0&&y<=m; }

void bfs(int sx,int sy) {
    dis[sx][sy]=0;
    q.push({sx,sy});
    while(!q.empty()) {
        pair<int,int> p=q.front(); q.pop();
        int x=p.first,y=p.second;
        for(int i=0;i<4;i++) {
            int xx=x+dx[i],yy=y+dy[i];
            if(!inBound(xx,yy)||mp[xx][yy]) continue;
            if(dis[xx][yy]>dis[x][y]+1) {
                dis[xx][yy]=dis[x][y]+1;
                q.push({xx,yy});
            }
            if(xx==ex&&yy==ey) return;
        }
    }
}
int main() {
    scanf("%d%d",&n,&m);
    memset(dis,0x3f3f3f,sizeof dis);
    for(int i=1;i<=n;i++)
        for(int j=1;j<=m;j++)
            scanf("%d",&mp[i][j]);
    bfs(1,1);
    printf("%d",dis[ex][ey]);
    return 0;
}
```

### 3.3 常用搜索剪枝方法

*   可行性剪枝：判断继续搜索是否能得到答案，如果不能，就返回
    
*   排除等效冗余：在搜索的几个分支中具有完全相同的效果时，选择其中一个走即可
    
*   最优性剪枝：当前搜索到的解已经超过最优解，就返回
    
*   顺序剪枝：优化搜索顺序，更快得到解
    
*   记忆化：记录每个状态的搜索结果，在后续搜索过程中检索这个状态，可直接使用
    

## 4 基础图论

### 4.1 拓扑排序

```cpp nocollapse
queue<int> q;
void topsort() {
    while(!q.empty()) {
        int x=q.front(); q.pop();
        reg[++cnt]=x;
        for(int i=head[x];i;i=nxt[i]) {
            int y=ver[i];
            if(!--deg[y]) q.push(y);
        }
    }
}
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=m;i++) {
        int x,y;
        scanf("%d%d",&x,&y);
        add(x,y); deg[y]++;
    }
    for(int i=1;i<=n;i++) 
        if(!deg[i]) q.push(i);
    topsort();
    if(cnt==n) 
        for(int i=1;i<=n;i++) printf("%d ",reg[i]);
    else printf("-1");
}
```

### 4.2 Dijkstra 单源最短路

```cpp nocollapse
priority_queue<PII> q;
void dijkstra(int st) {
    q.push({0,st});
    dis[st]=0;
    while(!q.empty()) {
        auto p=q.top(); q.pop();
        int x=p.second;
        if(vis[x]) continue;
        vis[x]=1;
        for(int i=head[x];i;i=nxt[i]) {
            int y=ver[i],z=edg[i];
            if(dis[y]>dis[x]+z) {
                dis[y]=dis[x]+z;
                q.push({-dis[y],y});
            }
        }
    }
}
```

### 4.3 SPFA

#### 4.3.1 最短路

```cpp nocollapse
queue<int> q;
void spfa(int st) {
    q.push(st);
    vis[st]=1,dis[st]=0;
    while(!q.empty()) {
        int x=q.front(); q.pop();
        vis[x]=0;
        for(int i=head[x];i;i=nxt[i]) {
            int y=ver[i],z=edg[i];
            if(dis[y]>dis[x]+z) {
                dis[y]=dis[x]+z;
                if(!vis[y]) {
                    vis[y]=1;
                    q.push(y);
                }
            }
        }
    }
}
```

#### 4.3.2 负环问题

将所有点压入队列，跑spfa时记录路径长度

超过总点数 $n$ 则一定在环上跑了不止一次，即存在负环

```cpp nocollapse
void spfa() {
    for(int i=1;i<=n;i++) 
        vis[i]=1,q.push(i);
    while(!q.empty()) {
        int x=q.front(); q.pop();
        vis[x]=0;
        for(int i=head[x];i;i=nxt[i]) {
            int y=ver[i],z=edg[i];
            if(dis[y]>dis[x]+z) {
                dis[y]=dis[x]+z;
                cnt[y]=cnt[x]+1;
                if(cnt[y]>=n) {
                    printf("Yes");
                    exit(0);
                }
                if(!vis[y]) {
                    vis[y]=1;
                    q.push(y);
                }
            }
        }
    }
}
```

#### 4.3.3 Bellman-Ford 边数限制最短路

```cpp nocollapse
int n,m,k,dis[N],pre[N];
struct Edge{int x,y,z;} e[M];
void Bellman_Ford() {
    memset(dis,0x3f,sizeof dis);
    dis[1]=0;
    for(int i=1;i<=k;i++) {
        memcpy(pre,dis,sizeof dis);
        for(int j=1;j<=m;j++) {
            int x=e[j].x,y=e[j].y,z=e[j].z;
            dis[y]=min(dis[y],pre[x]+z);
        }     
    }
}
int main() {
    scanf("%d%d%d",&n,&m,&k);	// k为最短路边数限制
    for(int i=1;i<=m;i++)
        scanf("%d%d%d",&e[i].x,&e[i].y,&e[i].z);
    Bellman_Ford();
}
```

### 4.4 Floyd 最短路

```cpp nocollapse
void Floyd() {
    for(int k=1;k<=n;k++)
        for(int i=1;i<=n;i++)
            for(int j=1;j<=n;j++)
                dis[i][j]=min(dis[i][j],dis[i][k]+dis[k][j]);
}
int main() {
    scanf("%d%d",&n,&m);
    memset(dis,0x3f3f3f,sizeof dis);
    for(int i=1;i<=n;i++) dis[i][i]=0;
    while(m--) {
        scanf("%d%d%d",&x,&y,&z);
        dis[x][y]=min(dis[x][y],z);		// 防止重边
    }
    Floyd();
}
```

### 4.5 最小生成树

#### 4.5.1 Kruskal

适用于稀疏图

```cpp nocollapse
struct Node{int x,y,z;} e[N<<1];
bool cmp(Node a,Node b) {return a.z<b.z;}
int find(int x) {
    if(x==fa[x]) return x;
    return fa[x]=find(fa[x]);
}
void Kruscal() {
    sort(e+1,e+m+1,cmp);
    for(int i=1;i<=m;i++) {
        int x=find(e[i].x),y=find(e[i].y);
        if(x==y) continue;
        fa[x]=y; tot++; ans+=e[i].z;
        if(tot==n-1) return;
    }
}
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) fa[i]=i;
    for(int i=1;i<=m;i++)
        scanf("%d%d%d",&e[i].x,&e[i].y,&e[i].z);
    Kruscal();
    if(tot==n-1) printf("%d",ans);
    else puts("Error");
}
```

#### 4.5.2 Prim

适用于稠密图

```cpp nocollapse
priority_queue<pair<int,int> > q;
void prim() {
    memset(dis,0x3f3f3f,sizeof dis);
    dis[1]=0;
    q.push({0,1});
    while(!q.empty()&&cnt<n) {
        int d=-q.top().first;
        int x=q.top().second;
        q.pop();
        if(vis[x]) continue;
        vis[x]=1;
        cnt++,ans+=d;
        for(int i=head[x];i;i=nxt[i]) {
            int y=ver[i],z=edg[i];
            if(dis[y]>z) {
                dis[y]=z;
                q.push({-dis[y],y});
            }
        }
    }
}
int main() {
    scanf("%d%d",&n,&m);
    while(m--) {
        int x,y,z;
        scanf("%d%d%d",&x,&y,&z);
        add(x,y,z); add(y,x,z);
    }
    prim();
    if(cnt==n) printf("%d",ans);
    else puts("Illegal");
}
```

### 4.6 二分图

#### 4.6.1 二分图判定（染色法）

```cpp nocollapse
void dfs(int x) {
    for(int i=head[x];i;i=nxt[i]) {
        int y=ver[i];
        if(f[y]==INF) f[y]=f[x]^1,dfs(y);
        else if(f[y]==f[x]) {printf("No");exit(0);}
    }
}
int main() {
    memset(f,0x3f3f3f,sizeof f);
    scanf("%d%d",&n,&m);
    for(int i=1;i<=m;i++) {
        int x,y;
        scanf("%d%d",&x,&y);
        add(x,y); add(y,x);
    }
    for(int i=1;i<=n;i++) if(f[i]==INF) f[i]=0,dfs(i);
    printf("Yes");
}
```

#### 4.6.2 二分图匹配（匈牙利算法）

（又名找对象算法）

寻找最大匹配

```cpp nocollapse
/* …… */
int find(int x) {
    for(int i=head[x];i;i=nxt[i]) {
        int y=ver[i];
        if(vis[y]) continue;
        vis[y]=1;
        if(!p[y]||find(p[y]))   //对方还没对象或者对方的对象有备胎
            return p[y]=x;      //找到了对象
    }
    return 0;
}
int main() {
    scanf("%d%d%d",&n1,&n2,&m);
    while(m--) {
        scanf("%d%d",&x,&y);
        add(x,y);
    }
    for(int i=1;i<=n1;i++) {
        memset(vis,0,sizeof vis);
        if(find(i)) ans++;
    }
    printf("%d",ans);
}
```

### 4.7 LCA（最近公共祖先）

```cpp nocollapse
t=log2(n)+1;
void dfs(int x,int fa) {
    f[x][0]=fa,d[x]=d[fa]+1;
    for(int i=1;i<=t;i++) f[x][i]=f[f[x][i-1]][i-1];
    for(int i=head[x];i;i=nxt[i]) if(ver[i]^fa) dfs(ver[i],x);
}
int lca(int x,int y) {
    if(d[x]>d[y]) x^=y^=x^=y;
    for(int i=t;i>=0;i--) if(d[f[y][i]]>=d[x]) y=f[y][i];
    if(x==y) return x;
    for(int i=t;i>=0;i--) if(f[x][i]^f[y][i]) x=f[x][i],y=f[y][i];
    return f[x][0];
}
```

## 5 基础数学

### 5.1 质数

#### 5.1.1 试除法判质数

重要性质：素数的形式均为 $6x+1$ 或 $6x+5$

```cpp nocollapse
bool isPrime(int x) {	// 加快判断
    if(x<=3) return x>1;
    else if(x%6!=1&&x%6!=5) return 0;
    else for(int i=5;i<=sqrt(x);i+=6) 
        if(!(x%i)||!(x%(i+2))) return 0;
    return 1;
}
bool isPrime2(int x) {	// 朴素判断
    if(x<2) return 0;
    for(int i=2;i<=sqrt(x);i++)
        if(!(x%i)) return 0;
    return 1;
}
```

#### 5.1.2 线性筛素数

若 $i$ 整除 $p_j$，则 $i \times p_k (k>j)$ 一定被 $p_j$ 乘某个数筛掉，即

**若 $p_j|i$，则对于 $\forall k>j$, $\exists \lambda’$ 使得 $ip_k=\lambda’ p_j$**

> [!IMPORTANT]
> 线性筛的关键不在“筛掉合数”，而在“每个合数只被它的最小质因子筛一次”。因此遇到 `i % p[j] == 0` 后必须 `break`。

简单证明：

$p$ 数组单调递增，设 $i=\lambda p_j$ ，则 $i p_k=(\lambda p_j) p_k=(\lambda p_k) p_j=\lambda’ p_j$

```cpp nocollapse
void prime() {
    for(int i=2;i<=n;i++) {
        if(!vis[i]) p[++cnt]=i;
        for(int j=1;j<=cnt&&i*p[j]<=n;j++) {
            vis[i*p[j]]=1;
            if(i%p[j]==0) break;
        }
    }
}
```

#### 5.1.3 分解质因数

不需要筛素数，直接分解即可

```cpp nocollapse
void part(int x){
    for(int i=2;i<=x/i;i++){
        if(!(x%i)) {
            int cnt=0;
            while(!(x%i)) x/=i,cnt++; 
            reg[++tot]={i,cnt};
        }
    } 
    if(x>1) reg[++tot]={x,1};
}
```

#### 5.1.4\* 短区间二次筛法

【例】给定两个整数 $L$ 和 $R$，在闭区间 $[L,R]$ 内找到距离最接近的两个相邻质数 $C_1$ 和 $C_2$ 和距离最远的两个相邻质数 $D_1$ 和 $D_2$，若存在相同距离的其他相邻质数对，则均输出第一对。

$1 \leq L < R \leq 2^{31}-1$

$1 \le R-L \leq 10^6$

先筛小范围质数，再筛 $[L,R]$ 中的质数

（$n$ 是合数，则 $n$ 一定有 $\sqrt{n}$ 以内的质因子）

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e6+10;
typedef long long ll;
int n,l,r,mi,ma,p[N],pp[N],tot,cnt;
bool vis[N],st[N];
void prime(int m) {
    vis[1]=1;
    for(int i=2;i<=m;i++) {
        if(!vis[i]) p[++tot]=i;
        for(int j=1;j<=tot&&p[j]<=m/i;j++) {
            vis[i*p[j]]=1;
            if(i%p[j]==0) break;
        }
    }
}
int main() {
    prime(50000);
    while(scanf("%d%d",&l,&r)!=EOF) {
        memset(st,0,sizeof st);
        cnt=0,mi=ma=1;
        for(int i=1;i<=tot;i++)
            for(int j=max(2ll,((ll)l+p[i]-1)/p[i]);j<=(ll)r/p[i];j++)
                st[j*p[i]-l]=1;
        for(int i=0;i<=r-l;i++)
            if(!st[i]&&l+i>=2)
                pp[++cnt]=i+l;
        if(cnt<2) {
            puts("There are no adjacent primes.");
            continue;
        }
        for(int i=2;i<cnt;i++) {
            if(pp[i+1]-pp[i]<pp[mi+1]-pp[mi]) mi=i;
            if(pp[i+1]-pp[i]>pp[ma+1]-pp[ma]) ma=i;
        }
        printf("%d,%d are closest, %d,%d are most distant.\n",pp[mi],pp[mi+1],pp[ma],pp[ma+1]);
    }
}
```

### 5.2 约数

#### 5.2.1 最大公约数 & 最小公倍数

辗转相除法

```cpp nocollapse
int gcd(int x,int y) {return y?gcd(y,x%y):x;}
int lcm(int x,int y) {return (ll)x*y/gcd(x,y);}
```

#### 5.2.2 约数个数

设 $x$ 有 $n$ 个质因数 $a_i(1\leq i \leq n)$ ，每个质因数 $a_i$ 共有 $k_i$个，即 $a_i^{k_i}|x$ ，

则对于 $a_i$，有 $(k_i+1)$ 种类选择，即 $0,1,2,\cdots,k_i$

因此 **$x$ 的因数个数为 $\prod_i{(k_i+1)}$**

#### 5.2.3 约数之和

若 $$N=\prod_{i}{p_i^{c_i}}$$  
约数个数：$$\prod_{i}{(c_i+1)}$$  
约数之和：$$\prod_{i}{\sum_{j=0}^{c_i}{p_i^j}}=\prod_i{\frac{p_i^{c_i+1}-1}{p_i-1}}$$

### 5.3 逆元

[逆元公式推导详解](https://www.luogu.com.cn/blog/virus2017/post-ni-yuan-ta-zhan-ou-ji-li-dei-shuo-xue-post)

当求解公式：$(a/b)\bmod m$ 时，因 $b$ 可能会过大，会出现爆精度的情况，所以需变除法为乘法：

设 $b^{-1}$ 是 $b$ 的逆元，则有 $b\cdot b^{-1}\equiv1\pmod m$；

则  
$$  
\begin{align}  
(a/b) &\equiv (a/b)\cdot 1 \pmod m \\\\  
&\equiv (a/b)\cdot b\cdot b^{-1} \pmod m \\\\  
&\equiv a\cdot b^{-1} \pmod m  
\end{align}  
$$  
即 $a/b$ 的模等于 $a\cdot b^{-1}$ 的模；

#### 5.3.1 费马小定理

$$  
a^p≡a\mod p  
$$

也写作  
$$  
a^{p-1}≡1\mod p  
$$

若 $p$ 是素数，且 $inv$ 与 $p$ 互质，则  
$$  
inv^{p-1}≡(1\%p)  
$$  
根据逆元的定义可得  
$$  
x*inv≡1\mod p  
$$  
得出乘法逆元  
$$  
inv=x^{p-2}  
$$

前提：$p$ 是质数

```cpp nocollapse
const int mod=1e9+7;
ll ksm(ll a,ll b) {
    ll ret=1;
    for(;b;b>>=1,(a*=a)%=mod) if(b&1) (ret*=a)%=mod;
    return ret;
}
ll inv(ll a) {
	return ksm(a,mod-2);
}
```

#### 5.3.2 扩展欧几里得

对于不完全为 $0$ 的非负整数 $a,b$，必然存在整数对 $x,y$ ，使得 $gcd(a,b)=ax+by$。

证明：

*   当 $b=0$ 时，$gcd(a,b)=a$，因此 $x=1,y=0$
    
*   当 $b \neq 0$ 时，$gcd(a,b)=gcd(b,a\%b)$，则
    
    $$  
    \begin{align}  
    ax+by &= gcd(a,b)=gcd(b,a\%b)=bx’+(a\%b)y’ \\\\  
    &= bx’+(a-b*\lfloor a/b\rfloor)y’ \\\\  
    &= ay’+b(x’-\lfloor a/b\rfloor)y’  
    \end{align}  
    $$
    
    可得：  
    $$  
    \begin{cases} x=y’ \\\\  
    y=x’-\lfloor a/b\rfloor \end{cases}  
    $$
    

```cpp nocollapse
ll exgcd(ll a, ll b, ll &x, ll &y) {
    if (!b) { x=1,y=0; return a; }
    else {
        ll r=exgcd(b,a%b,y,x);
        y-=x*(a/b);
        return r;
    }
}
ll inv(ll a, ll mod) {
    ll x,y;
    exgcd(a,mod,x,y);
    x=(x%mod+mod)%mod;
    return x;
}
```

#### 5.3.3 线性求逆元

已知一个质数$M$，求出 $1→n$ 中每个数关于模 $M$ 的逆元

$$  
inv[i]=(M-\lfloor{M/i}\rfloor)*inv[M\%i]%M  
$$

```cpp nocollapse
void init_inv(int n,int p) {
    inv[1]=1;
    for(int i=2;i<=n;i++) {
    	inv[i]=(ll)(p-p/i)*inv[p%i]%p;
    	printf("%d\n",inv[i]);
	}
}
```

### 5.4 组合数

#### 5.4.1 递推法

$$  
C_n^m=C_{n-1}^{m-1}+C_{n-1}^{m}  
$$

```cpp nocollapse
void init(int n) {
    for(int i=0;i<=n;i++)
		for(int j=0;j<=i;j++)
			C[i][j]=j?(C[i-1][j-1]+C[i-1][j])%mod:1;
}
```

#### 5.4.2 公式法

$$  
C_n^m=\frac{n!}{m!(n-m)!}  
$$

线性预处理阶乘和阶乘的逆元

```cpp nocollapse
const int mod=1e9+7,N=1e5+10;
typedef long long ll;
ll fac[N]={1ll},inv[N]={1ll};
ll ksm(ll a,int k) {
    ll res=1ll;
    for(;k;(a*=a)%=mod,k>>=1) if(k&1) (res*=a)%=mod; 
    return res;
}
void init(int n) {
    for(int i=1;i<=n;i++) {
        fac[i]=fac[i-1]*i%mod;
        inv[i]=inv[i-1]*ksm(i,mod-2)%mod;
    }
}
ll C(ll a,ll b) {
    return (ll)fac[a]*inv[b]%mod*inv[a-b]%mod;
}
```

#### 5.4.3 Lucas定理

$$  
C(n,m)=C(n/p,m/p)∗C(n\%p,m\%p)  
$$

适用于 $n,m$ 较大时求组合数

```cpp nocollapse
ll ksm(ll a,int k) {
    ll res=1ll;
    for(;k;(a*=a)%=mod,k>>=1) if(k&1) (res*=a)%=mod; 
    return res;
}
ll C(ll a,ll b) {
    if(a<b) return 0;
    if(a<mod&&b<mod) return (fac[a]*inv[b]%mod)*(inv[a-b]%mod)%mod;
    else return C(a/mod,b/mod)*C(a%mod,b%mod)%mod;
}
void pre() {
    for(int i=1;i<=1e5;i++) {
        fac[i]=fac[i-1]*i%mod;
        inv[i]=inv[i-1]*ksm(i,mod-2)%mod;
    }
}
int main() {
    scanf("%d",&m);
    while(m--) {
        scanf("%lld%lld%d",&a,&b,&mod);
        pre();
        printf("%lld\n",C(a,b));
    }
}
```

#### 5.4.4 质因数分解法

$n!$ 中质因数 $p$ 的个数，即统计 $p$ 的出现次数，再统计 $p^2$ 的出现次数，依次类推，即  
$$  
\begin{align}  
\text{cnt}(n,p) &=\lfloor \frac{n}{p} \rfloor + \lfloor \frac{n}{p^2} \rfloor + \lfloor \frac{n}{p^3} \rfloor + \cdots \\\\  
&= \lfloor \frac{n}{p} \rfloor + \lfloor \frac{n/p}{p} \rfloor + \lfloor \frac{n/p^2}{p} \rfloor + \cdots  
\end{align} \\\\  
$$

$$  
C^b_a=\frac{a!}{b!(a−b)!} = \prod_i{p_i^{\text{cnt}(a,p_i)-\text{cnt}(b,p_i)-\text{cnt}(a-b,p_i)}}  
$$

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=5010;
int a,b,tot,p[N],cnt[N];
bool vis[N];
vector<int> mul(vector<int> a,int b) { // 高精乘
    vector<int> ret;
    int t=0;
    for(int i=0;i<a.size();i++) {
        t+=a[i]*b;
        ret.push_back(t%10);
        t/=10;
    }
    while(t) ret.push_back(t%10),t/=10;
    while(ret.size()>1&&ret.back()==0) ret.pop_back();
    return ret;
}
void prime(int n) { 		// 线性筛素数
    for(int i=2;i<=n;i++) {
        if(!vis[i]) p[++tot]=i;
        for(int j=1;j<=tot&&p[j]<=n/i;j++) {
            vis[p[j]*i]=1;
            if(!(i%p[j])) break;
        }
    }
}
int cal(int n,int p) { 		// 计算cnt(n,p)
    int res=0;
    while(n) res+=n/p,n/=p;
    return res;
}
int main() {
    scanf("%d%d",&a,&b);
    prime(a);
    for(int i=1;i<=tot;i++)
        cnt[i]=cal(a,p[i])-cal(a-b,p[i])-cal(b,p[i]);
    vector<int> res;
    res.push_back(1);
    for(int i=1;i<=tot;i++)
        for(int j=0;j<cnt[i];j++)
            res=mul(res,p[i]);
    for(int i=res.size()-1;i>=0;i--) printf("%d",res[i]);
}
```

### 5.5 欧拉函数

#### 5.5.1 单点求欧拉函数

$1∼N$ 中与 $N$ 互质的数的个数被称为欧拉函数，记为 $\varphi(N)$。  
若在算数基本定理中，$$N=p^{a_1}_1p^{a_2}_2 \cdots p^{a_m}_m$$则：  
$$  
\varphi(N) = N\times\frac{p_1−1}{p_1}\times \frac{p_2−1}{p_2}\times\cdots\times\frac{p_m−1}{p_m}  
$$

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,tmp;
int part(int x) {
    int res=x;
    for(int i=2;i<=x/i;i++) {
        if(x%i==0) (res/=i)*=i-1;
        while(x%i==0) x/=i;
    }
    if(x>1)  (res/=x)*=x-1;
    return res;
}
int main() {
    scanf("%d",&n);
    while(n--) {
        scanf("%d",&tmp);
        printf("%d\n",part(tmp));
    }
    return 0;
}
```

#### 5.5.2\* 筛法求欧拉函数

```cpp nocollapse
void eular() {
    for(int i=2;i<=n;i++) {
        if(!vis[i]) p[++tot]=i,e[i]=i-1;
        for(int j=1;p[j]<=n/i;j++) {
            int t=i*p[j];
            vis[t]=1;
            if(!(i%p[j])) {
                e[t]=e[i]*p[j];
                break;
            }
            e[t]=e[i]*(p[j]-1);
        }
    }
}
```

### 5.6 高斯消元

列主元法消元

每次选择一列中绝对值最大的元素作为主元，保证消元过程收敛

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=110;
const double eps=1e-8;
int n;
double a[N][N];
int gauss() {
    int c,r;
    for(c=0,r=0;c<n;c++,r++) {
        //选列主元
        int t=r;        
        for(int i=r;i<n;i++)
            if(fabs(a[i][c])>fabs(a[t][c])) t=i;
        if(fabs(a[t][c])<eps) {r--;continue;}
        //交换主元所在行
        for(int i=c;i<=n;i++) swap(a[t][i],a[r][i]);
        //单位化
        double s=a[r][c]; a[r][c]=1.00;
        for(int i=c+1;i<=n;i++) a[r][i]/=s;
        //消元
        for(int i=r+1;i<n;i++)
            for(int j=c+1;j<=n;j++)
                a[i][j]-=a[r][j]*a[i][c];
    }
    if(r<n) {
        for(int i=r;i<n;i++)
            if(fabs(a[i][n])>eps) return -1; //无解
        return 0; //无穷多组解
    }
    //回代
    for(int i=n-1;i>=0;i--)
        for(int j=i+1;j<n;j++)
            a[i][n]-=a[i][j]*a[j][n];
    return 1; //唯一解
}
int main() {
    scanf("%d",&n);
    for(int i=0;i<n;i++)
        for(int j=0;j<=n;j++)
            scanf("%lf",&a[i][j]);
    int t=gauss();
    if(t==-1) puts("No solution");
    else if(!t) puts("Infinite group solutions");
    else {
        for(int i=0;i<n;i++) {
            if(fabs(a[i][n])<eps) a[i][n]=0;
            printf("%.2lf\n",a[i][n]);
        }
    }
    return 0;
}
```

## 6 贪心

### 6.1 区间问题

#### 6.1.1 区间选点

选多少个点使得每个区间至少有一个点：**右端点排序**

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
int n,ans,minn=-1e9-10;
struct Line {int l,r;} r[N];
bool cmp(Line a,Line b) {return a.r<b.r;}
int main() {
    scanf("%d",&n);
    for(int i=1;i<=n;i++) scanf("%d%d",&r[i].l,&r[i].r);
    sort(r+1,r+n+1,cmp);
    for(int i=1;i<=n;i++)
        if(minn<r[i].l)
            ans++,minn=r[i].r;
    printf("%d\n",ans);
    return 0;
}
```

#### 6.1.2 最多不相交区间数量

选择尽量多的不相交的区间：**右端点排序**

代码同 6.1.1

#### 6.1.3 区间覆盖

选择尽量少的区间，将指定线段区间完全覆盖：**左端点排序**

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
int n,st,ed,ans;
bool f;
struct Line {int l,r;} a[N];
bool cmp(Line a,Line b) {return a.l<b.l;}
int main() {
    scanf("%d%d%d",&st,&ed,&n);
    for(int i=1;i<=n;i++)
        scanf("%d%d",&a[i].l,&a[i].r);
    sort(a+1,a+n+1,cmp);
    for(int i=1;i<=n;i++) {
        int j,max_r=-2e9-10;
        for(j=i;j<=n&&a[j].l<=st;j++) 
            max_r=max(max_r,a[j].r);
        if(max_r<st) {ans=-1;break;}
        ans++;
        if(max_r>=ed) {f=1;break;}
        st=max_r;
        i=j-1; 
    }
    printf("%d\n",f?ans:-1);
    return 0;
}
```

#### 6.1.4 区间分组

将所给区间分为尽量少的若干组，组内区间不相交：**左端点排序**

每次向**空余位置最靠左的分组**内放区间

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
int n,m;
struct Line {int l,r;} line[N];
priority_queue<int,vector<int>,greater<int> > q;
bool cmp(Line a,Line b) {return a.l<b.l;}
int main() {
    scanf("%d",&n);
    for(int i=1;i<=n;i++) 
        scanf("%d%d",&line[i].l,&line[i].r);
    sort(line+1,line+n+1,cmp);
    for(int i=1;i<=n;i++) {
        if(q.empty()||line[i].l<=q.top()) q.push(line[i].r);
        else {
            q.pop();
            q.push(line[i].r);
        }
    }
    printf("%d",q.size());
}
```

也可使用差分寻找**区间重叠最厚处**即为分组数

```cpp
#include<bits/stdc++.h>
using namespace std;
map<int,int> d;
int n,s,ans;
int main() {
    scanf("%d",&n);
    while(n--) {
        int l,r;
        scanf("%d%d",&l,&r);
        d[l]++; d[r+1]--;
    }
    for(auto i:d) {
        s+=i.second;
        ans=max(ans,s);
    }
    printf("%d",ans);
    return 0;
}
```

以及一些奇技淫巧？

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e5+5;
int n,a[N],b[N],j=1,ans;
int main() {
    scanf("%d",&n);
    for(int i=1;i<=n;i++) scanf("%d%d",a+i,b+i);
    sort(a+1,a+n+1); sort(b+1,b+n+1);
    for(int i=1;i<=n;i++)
        (a[i]<=b[j])?ans++:j++;
    printf("%d\n",ans);
}
```

### 6.2 排序不等式

逆序 $\cdot$ 正序 $\leq$ 乱序 $\cdot$ 正序 $\leq$ 正序 $\cdot$ 正序

排队问题，最短时间优先原理，快者优先

【例】$n$ 个人排队打水，每个人的打水时间为 $a_i$，求最小等待时间之和。

```cpp
#include<bits/stdc++.h>
long long n,ans,a[100010];
int main() {
    scanf("%lld",&n);
    for(int i=1;i<=n;i++) scanf("%lld",a+i);
    sort(a+1,a+n+1);
    for(int i=1;i<=n;i++) a[i]+=a[i-1],ans+=a[i-1];
    printf("%lld",ans);
}
```

### 6.3 二分答案+贪心验证

当题目中有**使最小值最大**或**使最大值最小**的意图时，考虑二分答案

二分答案，将答案进行可行性验证（多数情况为贪心验证）

二分答案的使用条件：答案要随着决策的增减而**单调增/减**

【例】[跳石头](https://www.luogu.com.cn/problem/P2678)

```cpp
#include<bits/stdc++.h>
using namespace std;
int l,n,m,d[50010],ans; 
bool check(int x) {
	int t=0,cnt=0;
	for(int i=1;i<=n+1;i++) {
		if(d[i]-t<x) cnt++;
		else t=d[i];
	}
	return cnt<=m;
} 
int main() {
	scanf("%d%d%d",&l,&n,&m);
	for(int i=1;i<=n;i++) scanf("%d",d+i);
	d[n+1]=l;
	int L=1,R=l;
	while(L<=R) {
		int mid=(L+R)>>1;
		if(check(mid)) ans=mid,L=mid+1;
		else R=mid-1;
	}
	printf("%d",ans);
	return 0;
}
```

## 7 动态规划（dp）

## 8 背包问题

背包问题作为动态规划的一类重要问题，单独展开。

### 8.1 01背包

> $N$ 件物品，每件物品 $i$ 体积为 $c_i$，价值为$w_i$
> 
> 一个容量为 $M$ 的背包，物品总体积不超过背包容量，且总价值最大

朴素解法：

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1010,M=1010;
int n,m,c[N],w[N],f[N][M];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d%d",c+i,w+i);
    for(int i=1;i<=n;i++)    
        for(int j=0;j<=m;j++) {
            f[i][j]=f[i-1][j];
            if(j>=c[i]) f[i][j]=max(f[i][j],f[i-1][j-c[i]]+w[i]);
        }
    printf("%d",f[n][m]);
}
```

改变遍历顺序，滚动数组空间优化

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1010;
int n,m,f[M];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) {
        int c,w;
        scanf("%d%d",&c,&w);
        for(int j=m;j>=c;j--)
            f[j]=max(f[j],f[j-c]+w);
    }
    printf("%d",f[m]);
}
```

### 8.2 完全背包

> $N$ 种物品，每种物品 $i$ 体积为 $c_i$，价值为$w_i$，每种物品有无限件
> 
> 一个容量为 $M$ 的背包，物品总体积不超过背包容量，且总价值最大

与01背包相比，每件物品可以装无限次，因此只需改变一下转移方程。

朴素解法：

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1010,M=1010;
int n,m,c[N],w[N],f[N][M];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d%d",c+i,w+i);
    for(int i=1;i<=n;i++)    
        for(int j=0;j<=m;j++) {
            f[i][j]=f[i-1][j];
            if(j>=c[i]) f[i][j]=max(f[i][j],f[i][j-c[i]]+w[i]);	// 与01背包的差别
        }
    printf("%d",f[n][m]);
}
```

滚动数组优化与01背包的差别在于体积的遍历顺序：

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1010;
int n,m,f[M];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) {
        int c,w;
        scanf("%d%d",&c,&w);
        for(int j=c;j<=m;j++)	// 与01背包的差别
            f[j]=max(f[j],f[j-c]+w);
    }
    printf("%d",f[m]);
}
```

### 8.3 多重背包

> $N$ 种物品，每种物品 $i$ 体积为 $c_i$，价值为$w_i$，每种物品有 $s_i$ 件
> 
> 一个容量为 $M$ 的背包，物品总体积不超过背包容量，且总价值最大

#### 8.3.1 朴素解法

遍历每件物品，对每件物品进行决策

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=101;
int n,m,f[M];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) {
        int c,w,s;
        scanf("%d%d%d",&c,&w,&s);
        for(int k=1;k<=s;k++)
            for(int j=m;j>=c;j--)
                f[j]=max(f[j],f[j-c]+w);
    }
    printf("%d",f[m]);
}
```

#### 8.3.2 二进制拆分

我们对于每个相同种类的物品都进行了一次遍历，而实际上这是冗余的。

我们可以将每种物品的个数进行**二进制拆分**，这样即可囊括每种物品选择 $0 \to s_i$ 件的情况

最后将问题转化为01背包

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=2010;
int n,m,f[M];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) {
        int c,w,s,k=1;
        scanf("%d%d%d",&c,&w,&s);
        for(int k=1;s>=k;s-=k,k<<=1)
            for(int j=m;j>=c*k;j--)
                f[j]=max(f[j],f[j-k*c]+k*w);
        if(s)
            for(int j=m;j>=s*c;j--)
                f[j]=max(f[j],f[j-s*c]+s*w);
    }
    printf("%d",f[m]);
}
```

### 8.4 混合背包

> $N$ 类物品，每类物品 $i$ 体积为 $c_i$，价值为$w_i$，以及一个属性 $s_i$
> 
> *   $s_i=-1$ 表示该类物品仅有一件
> *   $s_i=0$ 表示该类物品有无限件
> *   $s_i>0$ 表示该类物品有 $s_i$ 件
> 
> 一个容量为 $M$ 的背包，物品总体积不超过背包容量，且总价值最大

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=10010,M=1010;
int n,m,f[M];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) {
        int c,w,s;
        scanf("%d%d%d",&c,&w,&s);
        if(!s) {				// 完全背包
            for(int j=c;j<=m;j++)
                f[j]=max(f[j],f[j-c]+w);
        } else if(s<0||s==1) {	// 01背包
            for(int j=m;j>=c;j--)
                f[j]=max(f[j],f[j-c]+w);
        } else {				// 多重背包
            for(int k=1;s>=k;s-=k,k<<=1)
                for(int j=m;j>=c*k;j--)
                    f[j]=max(f[j],f[j-k*c]+k*w);
            if(s)
                for(int j=m;j>=s*c;j--)
                    f[j]=max(f[j],f[j-s*c]+s*w);
        }
    }
    printf("%d",f[m]);
}
```

### 8.5 分组背包

> $N$ 组物品，每组中有 $s_i$ 件
> 
> 第 $i$ 组中的物品 $j$ 体积为 $c_{ij}$，价值为$w_{ij}$，同一组内的物品只能选一个
> 
> 一个容量为 $M$ 的背包，物品总体积不超过背包容量，且总价值最大

对于一个组内的物品进行枚举，关键在于**组内只能选择一个**

因此需要注意**枚举背包体积**和**组内决策**的内外层关系

若内外层枚举顺序反置，则失去了组内约束，变成了普通01背包

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=101;
int n,m,c[N][N],w[N][N],s[N],f[N];
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) {
        scanf("%d",s+i);
        for(int j=1;j<=s[i];j++)
            scanf("%d%d",&c[i][j],&w[i][j]);
    }
    for(int i=1;i<=n;i++)
        for(int j=m;j>=0;j--)
            for(int k=1;k<=s[i];k++)
                if(j>=c[i][k])
                    f[j]=max(f[j],f[j-c[i][k]]+w[i][k]);
    printf("%d",f[m]);
}
```

### 8.6 二维费用背包

> $N$ 件物品，每件物品 $i$ 体积为 $c_i$，重量为$w_i$，价值为 $v_i$
> 
> 一个容积为 $V$，最大承重为 $M$ 的背包，使得总价值最大

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m1,m2,c1,c2,w,f[110][110];
int main() {
    scanf("%d%d%d",&n,&m1,&m2);
    for(int i=1;i<=n;i++) {
        scanf("%d%d%d",&c1,&c2,&w);
        for(int j=m1;j>=c1;j--)
            for(int k=m2;k>=c2;k--)
                f[j][k]=max(f[j][k],f[j-c1][k-c2]+w);
    }
    printf("%d",f[m1][m2]);
}
```

### 8.7 有依赖的背包

> $N$ 件物品，每件物品 $i$ 体积为 $c_i$，重量为$w_i$，价值为 $v_i$，其依赖物品编号为 $p_i$
> 
> 即 只有购置了 $p_i$ 物品，才能购置 $i$ 物品（ $p_i$ 是 $i$ 的前驱）
> 
> 一个容量为 $M$ 的背包，物品总体积不超过背包容量，且总价值最大

树形结构，使用记忆化搜索更新

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=110;
int n,m,r,f[N][N],c[N],w[N];
vector<int> e[N];
void dp(int x) {
    for(int i=c[x];i<=m;i++) f[x][i]=w[x];	// 必须买自己，才能买其附属物品
    for(int y:e[x]) {
        dp(y);
        for(int j=m;j>=c[x];j--)		// 枚举装入后的体积
            for(int k=0;k<=j-c[x];k++)		// 枚举新装入的子物品体积
                f[x][j]=max(f[x][j],f[x][j-k]+f[y][k]);
    }
}
int main() {
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) {
        int p;
        scanf("%d%d%d",c+i,w+i,&p);
        if(p==-1) r=i;
        else e[p].push_back(i);
    }
    dp(r);
    printf("%d",f[r][m]);
}
```
