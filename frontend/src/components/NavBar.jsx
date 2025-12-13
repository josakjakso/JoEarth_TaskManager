import React from 'react';
import bread from '../assets/pic/bread.png';

export default function NavBar() {
    return (
        <nav class="fixed top-0 left-0 w-full bg-gray-500">
            <div class=" px-12 sm:px-6 lg:px-40    ">
                <div class="relative flex h-16 items-center justify-between">
                    <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div class="flex shrink-0 items-center">
                            <img src={bread} class="h-8 w-auto" />
                        </div>
                        <div class="hidden sm:ml-6 sm:block">
                            <div class="flex space-x-4">
                                <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting1</a>
                                <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting2</a>
                                <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting3</a>
                                <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting4</a>
                            </div>

                        </div>
                        <div>
                        </div>
                    </div>
                    <div class="flex items-end">
                        <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">someting5</a>
                    </div>
                </div>
            </div>

        </nav>
    );
}