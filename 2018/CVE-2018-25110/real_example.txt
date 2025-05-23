---
title: Understanding Pointers, Ownership, and Lifetimes in Rust
summary: A summary of ownership related topics in Rust
date: 2013-12-21
---

------------------------------------------------------------------------

## Update 2015-03-15

I have updated this post to reflect the new syntax for boxes or owned
pointers in in rust 1.0.

------------------------------------------------------------------------

In the last couple of weeks I have been looking into [Rust][Rust], a
new language developed by the good folks at Mozilla. Rust is fairly
unique in that it is aimed at the same space as C++: a systems
programming language that gives you full control over memory but also
offers high level language features. In the past few years a few
languages have come out that claim to target this space, for example
[Go], [D], and [Nimrod]. However, these languages are garbage
collected by default and loose their memory safety when memory is
managed manually (D, Nimrod) or do not offer this possibility at all
(Go). Therefore, these languages are not well equiped for applications
which require full control over memory, which is the use case
where C++ shines.

I think it's great that C++ finally gets some real competition. Even
among C++ fans, few will deny that compatibility with C, decades of
language evolution, and accidental language features have created a
very complex language that is extremely difficult to master. I think
it is quite sad that for a lot of applications, C++ is still the only
sane choice. We need a simpler language that offers more modern
language features while targeting the same space. Rust could just be
that language.

Ok now, the point of this post is not to argue the case for [Rust] nor
to heap (well deserved) praise onto the Rust designers and
implementers. I want to talk about the ownership semantics in Rust and
how they interact with the different type of pointers in Rust.


## Rust's Guiding Principles

To me, understanding something means discovering and understanding the
reasons and guiding principles behind the things on the surface. From
these, it should be easy to reason about other things and quickly
understand why they must be one way and not another. To me the guiding
principles of memory managemend in Rust are the following:

1. __**Manual memory management**__: There must be some way for the
   programmer to control when an object on the heap will be deleted.

2. __**Memory safety**__: Pointers must never point to areas of memory
   that have been changed or deleted.

3. __**Safe Concurrency**__: There should be no dataraces between
   threads. Multiple threads must not read and modify the same part of
   memory at the same time.

4. __**Compile time checks**__: Ensure correctness at compile time
   instead of runtime whenever possible.

This, in conjunction with the features that Rust provides, will give
us a good idea why certain things must be the way they are in Rust.
This post focuses on exploring the memory management and safety aspects.


## Safe Manual Memory Management by Enforcing Ownership

The way Rust achieves safe manual memory management is by enforcing
sane ownership semantics through a number of different pointers.
There are several types of pointers in Rust: the most important are
*boxes or owned pointers* and *references or borrowed pointers*.
There are also different kinds of reference counted pointers, but
these are for more complicated situations which I won't get into in
this post.  Therefore, this post will focus on owned and borrowed
pointers.


### *Boxes* / *Owned Pointers*

A *box* or *owned pointer* in Rust has ownership over a certain part
of the heap. When it goes out of scope it deletes that part of the
heap.  This achieves *manual memory management*: the programmer has
control over when memory is released by controlling when an owned
pointer goes out of scope. A box is a datatype, parameterized by the
type that it boxes, so `Box<i32>` is the type of an owned pointer to
an `i32` and `Box::new(3)` is the literal notation for allocating
space on the heap for an i32, putting 3 into it and handling back an
owned pointer. Like all pointers, boxes are derferenced by prefixing
them with `*`. Here is a bit of a contrived example:

~~~{.rust}
// The type annotations in the let statements in this example
// (e.g. ': Box<int>') are not necessary and only for clarity

fn owned_seven() -> Box<i32> {
    // Allocate an i32 with value '3' on the heap, 'three' points to it
    let three : Box<i32> = Box::new(3);
    // The same for four
    let four : Box<i32> = Box::new(4);
    // Dereference both 'three' and 'four', add them, store the result
    // in a newly allocated variable on the heap
    Box::new(*three + *four)
}   // <-- 'three' and 'four' go out of scope, so the memory they own
    //     is released. The memory of the return value is owned by the
    //     return value so it survives the function call.
    // Note: returning a pointer from a function is considered an anti-
    // pattern in rust. It is prefered to return a value so the caller
    // can decide what he wants to do with it. This is done for illustration
    // purposes here.


fn main() {
    let seven : Box<i32> = owned_seven();
    println!("3 + 4 = {}", *seven);
}   // <-- seven goes out of scope and the memory it points to is
    //     deallocated here
~~~

### *Referneces* / *Borrowed Pointers*

Having only owned pointers would make writing many programs difficult:
there could only ever be one reference to every *thing*. Fortunately,
Rust offers another type of pointer called a *reference* or *borrowed
pointer*. References do not imply ownership and they can point to
objects both on the heap and the stack, so they are quite flexible.
We can create a reference by taking the address of something with the
*address-of* operator `&`. In a slight abuse of notation, the types of
references are also denoted by prefixing the type of the variable it
points to by `&`, so `&i32` is a borrowed pointer to an `i32`.

~~~{.rust}
fn main() {
    let three : &i32 = &3;
    let four : &i32 = &4;
    println!("3 + 4 = {}", *three + *four);
}
~~~

References in Rust are a lot like references and pass-by-reference
bound variables in C and C++, but note that unlike C/C++-references
borrowed pointers must be dereferenced to get to their values. I think
this is really more consistent, because references really hold the
address to a memory location, just like other pointes. So it makes
sense to treat them similarly in terms of syntax. References in Rust
also have a number of safety mechanisms that C/C++ references lack,
but more on that later.


## Move Semantics

*Memory safety* implies that owned pointers *cannot be copied or
cloned*. Otherwise, two such pointers could point to the same block of
memory and that memory would be deleted twice. Therefore, owned
pointers have move semantics:^[The other alternative would be that
owned pointers can never be reassigned, they would be non-copiable and
non-moveable. This seems pretty cumbersome, fortunately Rust's owned
pointers have move semantics.] when owned pointer `o2` is initialized
from owned pointer `o1`, `o1` is no longer valid. By guiding principle
number four, we would perfer to ensure this at compile time, and Rust
indeed does this.^[Ensuring the validity of owned pointers at compile
time is much better than the alternatives: If it was assured at
runtime, there would be fewer correctness guarantees about the program
and the check would have to be performed every time a pointer is
dereferenced. Checking the validity of pointers at compile time is a
major achievement of the Rust language: tracking such moves at compile
time requires an advanced type-system feature called [affine
types](http://en.wikipedia.org/wiki/Type_system). As far as I know
Rust is the only mainstreamy language which has such a feature.]

~~~{.rust}
fn main() {
   let o1 = Box::new("world");
   let o2 = o1;                // <-- o1 is 'moved' into o2 and now invalid
   println!("Hello, {}!", o1); // <-- this is a compile time error
}
~~~

Indeed the Rust compiler reports:

~~~
move.rs:4:27: 4:29 error: use of moved value: `o1`
move.rs:4    println!("Hello, {}!", o1); // <-- this is a compile time error
                                    ^~
~~~

### Structs and Enums

In general Rust has move semantics. When an object is initialized via
assignment its memory is moved to the newly assigned
variable. However, structs can implement the `Copy` trait, which means
they will have copy semantics instead: When assigned the new object
gets a bitwise copy of the object used to assign it.

The `Copy` trait cannot be implemented when an object contains a box:
the box does not implement the copy trait, so we can't copy it when
copying the object containing it. This makes sense because the box has
move semantics, the object containing it must also have move
semantics, otherwise we would again incur two independent owning
copies.

~~~{.rust}
// Derive the Copy trait so objects of this type have copy semantics
#[derive(Show,Copy)]
struct Pod {x: i32, y: u32}

// Can't derive the Copy trait because Box<T> does not have the Copy trait
#[derive(Show)]
struct WithBox {x: i32, p: Box<i32>}

fn main() {
   let a1 = Pod {x: 3, y: 4};
   let a2 = a1;
   println!("{:?}", a1);                   // <-- OK, a1 has been copied
   let b1 = WithBox {x: 3, p: Box::new(4)};
   let b2 = b1;
   println!("{:?}", b1);                   // <-- Compile time error, b1 has been moved
}
~~~

The same rules apply to enums, but here the error messages can be a bit
more confusing.

~~~{.rust}
enum MyEnum {
     X(i32),
     Y(Box<i32>)
}

fn match_and_print(e: &MyEnum) {
    match e {
        &MyEnum::X(x) => println!("{}", x),  // <-- OK, x can be copied
        &MyEnum::Y(y) => println!("{}", *y)  // <-- Error, y cannot be moved out of a reference
    }
}

fn main() {
   let x = MyEnum::X(3);
   let y = MyEnum::Y(Box::new(4));
   match_and_print(&x);
   match_and_print(&y);
}
~~~

In this case the compiler reports

~~~
move.rs:9:9: 9:22 error: cannot move out of borrowed content
move.rs:9         &MyEnum::Y(y) => println!("{}", *y)  // <-- Error, y cannot be moved out of a reference
                  ^~~~~~~~~~~~~
move.rs:9:20: 9:21 note: attempting to move value to here
move.rs:9         &MyEnum::Y(y) => println!("{}", *y)  // <-- Error, y cannot be moved out of a reference
                             ^
move.rs:9:20: 9:21 help: to prevent the move, use `ref y` or `ref mut y` to capture value by reference
move.rs:9         &MyEnum::Y(y) => println!("{}", *y)  // <-- Error, y cannot be moved out of a reference
                             ^
~~~

Standard pattern matches are pass-by-value, meaning that the contents
of the enum is moved. However, this can only be done when we have
ownership over the values to be moved. When we apply `match` to a
dereferenced borrowed pointer, we cannot move because we don't have
ownership. Changing the `match_and_print` function to take a value
would work again.

~~~{.rust}
fn match_and_print(e: MyEnum) {
    match e {
        MyEnum::X(x) => println!("{}", x),
        MyEnum::Y(y) => println!("{}", *y)
    }
}
~~~


### The `ref` Keyword

Moving values in pattern matches is not always what we want.
Sometimes we just want to take a reference. This way we can pattern
match on values which we have obtained via borrowed pointers or we can
simply avoid a move. This is where the `ref` keyword comes into play:
It changes the pass-by-value semantics of a pattern match to
pass-by-borrowed-pointer semantics:

~~~{.rust}
fn match_and_print(e: &MyEnum) {
    match e {
        &MyEnum::X(x) => println!("{}", x),
        &MyEnum::Y(ref y) =>                 // OK, y is a borrowed ptr to Box<int>
            println!("{}", **y)     // y has type &Box<int> and must be dereferenced twice
    }
}
~~~

To bind mutable references there is also the `ref mut` version which
allows modifying:

~~~{.rust}
fn match_and_print(e: &mut MyEnum) {
    match e {
        &mut MyEnum::X(x) => println!("{}", x),
        &mut MyEnum::Y(ref mut y) => {
            **y = 5;
            println!("{}", **y)
        }
    }
}

fn main() {
   let mut x = MyEnum::X(3);
   let mut y = MyEnum::Y(Box::new(4));
   match_and_print(&mut x);
   match_and_print(&mut y);
}
~~~

The `ref` keyword and its `ref mut` variant also work in `let` bindings:

~~~{.rust}
fn main() {
   let mut x = 3;
   let ref mut y = x;
   *y = 4;
   println!("{}", *y);
}
~~~


## Lifetimes

The difficulty with borrowed pointers is that they themselves cannot
ensure that they point to valid memory. What if the thing that owns
the memory they point to goes out of scope or is reassigned? Since the
borrowed pointer has no ownership that memory would be deleted and
possibly reassigned. The borrowed pointer would become a *dangling
reference*, which is precisely what we wanted to avoid per guiding
principle number 2: **memory safety**.

Therefore Rust must take a number of precautions to ensure these
scenarios do not happen. First, the memory that a borrowed pointer
points to must not be freed during that borrowed pointers
__**lifetime**__. Second, this memory __**must not change**__ while it
is borrowed.

The first requirement leads us to the concept of __**lifetimes**__,
the amount of time that some object is guaranteed to exist.

~~~{.rust}
fn lifetimes1() {
    let name = Box::new("world");      //                 <--+
    if 3 < 5 {                         //                    |
        let bname = &name;             // <--+               | name's
        println!("Hello, {}!", name);  //    | bname's       | lifetime
        println!("Hello, {}!", bname); //    | lifetime      |
    }                                  // <--+               |
}                                      //                 <--+
~~~

In this example, it is quite clear that the lifetime of `bname` will
be shorter than that of `name` and thus the compiler needs no help in
figuring this out. However, things need not always be this simple,
consider the following example:

~~~{.rust}
fn lifetimes2() {
    let mut x_ref = &3;       //                 <--+
    if true {                 //                    |
        let mut y_ref = &4;   // <--+ y_ref's       | x_ref's
        x_ref = y_ref;        //    | lifetime      | lifetime
    }                         // <--+               |
}                             //                 <--+
~~~

Here we have a problem: `x_ref` is reassigned to point to the same
memory location as `y_ref`, but `y_ref`'s lifetime is shorter than
`x_ref`'s. To ensure memory safety, the compiler must rejetct this
program, which it does:

~~~
lifetimes.rs:21:24: 21:26 error: borrowed value does not live long enough
lifetimes.rs:18:16: 24:1 note: borrowed pointer must be valid for the block at 18:16...
lifetimes.rs:20:12: 23:5 note: ...but borrowed value is only valid for the block at 20:12
~~~

Things become even more interesting when we work with borrowed
pointers inside of a function:

~~~{.rust}
fn min_life(x: &i32, y: &i32) -> &i32 {
    if *x < *y {
        x
    } else {
        y
    }
}
~~~

Here the lifetime of the result depends on the condition evaluated in
the if statement: depending on it the lifetime will either be that of
x or that of y. Clearly, the compiler can't resolve this
automatically, it would need to know the values to which x and y
point, which may only be known at runtime:

~~~
lifetimes.rs:1:33: 1:37 error: missing lifetime specifier [E0106]
lifetimes.rs:1 fn minLife(x: &i32, y: &i32) -> &i32 {
                                               ^~~~
lifetimes.rs:1:33: 1:37 help: this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `x` or `y`
lifetimes.rs:1 fn minLife(x: &i32, y: &i32) -> &i32 {
                                               ^~~~
~~~

Since the compiler can't infer the lifetimes we must annotate
them. Alas, we too would be hard pressed to give the exact lifetime
in this example. However, there is a trick by which we can manage this

~~~{.rust}
fn min_life<'a>(x: &'a i32, y: &'a i32) -> &'a i32 {
    if *x < *y {
        x
    } else {
        y
    }
}
~~~

Here we explictly annotate the lifetime of the parameters and the
return value. Lifetime parameters are introduced by a single tick `'`
followed by an identifier. In functions these must be the first
template parameters. As you can see we use the same parameter for the
lifetime everywhere. If the compiler would take this information
too literally, then this function whould be less flexible than we
might wish: In this case we could only use it on borrowed pointers
which have the exact same lifetime. Fortunately, the compiler
interprets the provided lifetimes as a lower bound. Thus `'a` is
the minimum of the lifetimes of `x` and `y`.
There is one special lifetime, which is called `'static` and is for
objects which are allocated for the entire life of the program.


## Freezing

Another problem with borrowed pointers is that the memory must not
be modified while it has been borrowed out. This is achieved by freezing
the original object when a borrowed pointer to it exists:

~~~{.rust}
fn freeze() {
    let mut x = 3;
    {
        let mut y = &x;
        x = 4;       // <-- Error: x has been borrowed and is thus `frozen`
    }
    x = 4;           // OK
}
~~~

In the block we cannot modify `x` because it is borrowed:

~~~
freeze.rs:5:9: 5:14 error: cannot assign to `x` because it is borrowed
freeze.rs:5         x = 4;       // <-- Error: x has been borrowed and is thus `frozen`
                    ^~~~~
freeze.rs:4:22: 4:23 note: borrow of `x` occurs here
freeze.rs:4         let mut y = &x;
                                 ^
~~~

Note that this restriction is irrespective of whether the borrowed
pointer is mutable or not.



[Rust]: http://www.rust-lang.org

[Go]: http://www.go-lang.org

[D]: http://www.dlang.org

[Nimrod]: http://www.nimrod-lang.org

[ManagedPtrRemoval]: http://pcwalton.github.io/blog/2013/06/02/removing-garbage-collection-from-the-rust-language/