import concurrently from "concurrently";

const { result } = concurrently([
    {
        command: "pnpm vite",
        name: "vite",
    },
    {
        command: "php artisan serve",
        name: "laravel",
    },
]);
result.then(success, failure);
function success(event) {
    // console.log('success', event);
}
function failure(event) {
    // console.log('failure', event);
}
