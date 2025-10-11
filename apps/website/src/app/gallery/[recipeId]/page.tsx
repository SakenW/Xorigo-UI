import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { unifiedRecipes, unifiedRecipeMap, getRecipePreviewColors } from '@th-ui/core/style-recipe'
import { RecipeDetailContent } from '@/components/gallery/recipe-detail-content'

/**
 * 生成所有配方的静态路径（SSG优化）
 */
export async function generateStaticParams() {
  return unifiedRecipes.map((recipe) => ({
    recipeId: recipe.id,
  }))
}

/**
 * 动态生成SEO元数据
 */
export async function generateMetadata(
  { params }: { params: Promise<{ recipeId: string }> }
): Promise<Metadata> {
  const { recipeId } = await params
  const recipe = unifiedRecipeMap[recipeId]

  if (!recipe) {
    return {
      title: '配方未找到 | TH-UI',
      description: '您访问的配方不存在',
    }
  }

  const colors = getRecipePreviewColors(recipeId)

  return {
    title: `${recipe.name} - ${recipe.description} | TH-UI 样式配方库`,
    description: `${recipe.description}。七轴参数：${recipe.mode}模式、${recipe.tone}色调、${recipe.density}密度。${recipe.tags.join('、')}。`,
    keywords: [
      'TH-UI',
      '样式配方',
      recipe.name,
      recipe.category,
      recipe.mode,
      ...recipe.tags,
    ],
    openGraph: {
      title: `${recipe.name} | TH-UI 样式配方库`,
      description: recipe.description,
      type: 'website',
      images: [
        {
          url: `/api/og?recipe=${encodeURIComponent(recipeId)}`,
          width: 1200,
          height: 630,
          alt: recipe.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.name} | TH-UI`,
      description: recipe.description,
    },
  }
}

/**
 * 配方详情页（Server Component）
 */
export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ recipeId: string }>
}) {
  const { recipeId } = await params
  const recipe = unifiedRecipeMap[recipeId]

  // 配方不存在，返回404
  if (!recipe) {
    notFound()
  }

  const colors = getRecipePreviewColors(recipeId)

  return (
    <div className="container mx-auto py-8">
      {/* 配方详情内容（Client Component处理交互） */}
      <RecipeDetailContent recipe={recipe} colors={colors} />
    </div>
  )
}
