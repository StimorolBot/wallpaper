import React from "react"
import "./style/about_img_card.sass"


export function AboutImgCard({ imgInfo }){
    return(
        <div className="about-img__card">
            { imgInfo?.map((item, index) => {
                 return(
                    <React.Fragment key={index}>
                    <div className="about__card-container">
                        <dt className="about__card-dt">Автор:</dt>
                        <dd className="about__card-dd">{item.user_name}</dd>
                    </div>
                    
                    <div className="about__card-container">
                        <dt className="about__card-dt">Стиль:</dt>
                        <dd className="about__card-dd">
                            {item.style}
                        </dd>
                    </div>
                    
                    <div className="about__card-container">
                        <dt className="about__card-dt">Дата создания:</dt>
                        <dd className="about__card-dd">
                            <time dateTime={item.create_date}>
                                {item.create_date.split("T")[0]}
                            </time>
                        </dd>
                    </div>

                    <div className="about__card-container">
                        <dt className="about__card-dt">Лайков:</dt>
                        <dd className="about__card-dd about__list-promt">
                            {item.like}
                        </dd>
                    </div>

                    <div className="about__card-container">
                        <dt className="about__card-dt">Дизлайков:</dt>
                        <dd className="about__card-dd about__list-promt">
                            {item.dislike}
                        </dd>
                    </div>
                    
                    <div className="about__card-container">
                        <dt className="about__card-dt">Промт:</dt>
                        <dd className="about__card-dd about__list-promt">
                            {item.prompt}
                        </dd>
                    </div>
                </React.Fragment> 
                )
            })}
        </div>
    )
}
