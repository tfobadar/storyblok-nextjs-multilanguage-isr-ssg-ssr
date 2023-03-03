import React from 'react'
import Layout from '../Components/Layout'
import DynamicComponent from '../Components/DynamicComponent'

import Storyblok, { useStoryblok } from "../utils/storyblok"
import Head from 'next/head';

export default function Page({ story, preview, locale, locales }) {
  const enableBridge = true; // load the storyblok bridge everywhere
  // use the preview variable to enable the bridge only in preview mode
  // const enableBridge = preview;
  story = useStoryblok(story, enableBridge, locale)

  return (
    <Layout locale={locale} locales={locales}>
      <Head>
        <script src="/js/jquery-2.1.1.min.js"></script>
        <script src="/js/face-api.js" />
      </Head>
      <DynamicComponent blok={story.content} />
    </Layout>
  )
}


export async function getStaticProps({ locale, locales, params, preview = false }) {
  let slug = 'home'

  let sbParams = {
    version: "draft", // or 'draft'
    resolve_relations: ["featured-posts.posts", "selected-posts.posts"],
    language: locale,
  }

  if (preview) {
    sbParams.version = "draft"
    sbParams.cv = Date.now()
  }

  let { data } = await Storyblok.get(`cdn/stories/${slug}`, sbParams)

  return {
    props: {
      story: data ? data.story : false,
      preview,
      locale,
      locales,
    }
  }
}


