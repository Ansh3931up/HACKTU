'use client'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="w-full bg-white  dark:bg-[#111011]">
      <div className=" mx-auto">
        <div className="flex justify-between items-center py-4 px-5">
          <div className="flex-1 min-w-0 md:text-left text-center">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
