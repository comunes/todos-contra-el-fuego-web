Feature: Test all secundary pages

  Background:
    Given I am on the home page

  Scenario: Check that all secondary pages work well
    Given a list of page ids and contents
      | license     | License          |
      | tos         | Terms of Service |
      | credits     | Credits          |
      | privacy     | Privacy Policy   |
      | activeFires | Active Fires     |
      | about       | About            |
    Then I check that all pages works properly

  Scenario: Check that all secondary pages work well when not logged
    Given I logout if logged
    And a list of page urls and contents
      | login                  | Login                   | true  |
      | signup                 | Sign Up                 | true  |
      | fires                  | Fires                   | true  |
      | zones                  | Monitored               | true  |
      | recover-password       | Recover Password        | true  |
      | verify-email/something | Verify                  | true  |
      | fire/inexistent        | This page doesn't exist | false |
      | fire/Fe26.2**1a0361ed0384f741403682e26b4bbc3850bee24e775da13c9782b22365ea895f*r_3gmVad5vzkeyqPpo6UcA*1s5fFz3iDGKTYP2RCvXMshof00QCHf4ErDl9K2dxoX0u-J-t6scyOWG8pGp3ehg_FfEtyR_kYcEKU3rE0jaSlZbD09TIvhiIJeS3C6Uc8YD-rit0XBrgsVKfYSxKzTRoOYiYFJ8JYd298hMtfiASePjS05Z58hhicyCcJYYRlarqDScG3LiVY3lL5y2nfcdIMNuSjCiKOJWuMkxwd9nR1UHMudLl0hEoy56mPdnHpDYtP9IYUlIOk1LlWBxcmHKifbXeqHu94p8j13Kk20dh2R49Hw3KsSoE9UbWmGQA9wAZXT82301i3rGF5GPAKjlTlRYcWisQurnPwHSVmx3DhUdiYwKGxt4KeaM5QVI4BE9octvE41OOprB_-Il105diQEh2Y9vdvX51ZVWIRfCboICPM6rJb0Oin7U7F1iM-oD_5s3DGnelfM5LGBcKwiB5paMo5M5vdBMaO-zR216cW9yGVXw9IZqHx8xDQWnoHAZjt8NLHeiGF2QOmIGtEUH7qnwhGpkcvszajmAZzR8saZgoH1qfBfvpVA41YfV14gU**4d030f05e23ad75409cebc609107467fc60be5077d52cf041087cd024fc4dc45*GY97aGFc1MyAsoO3Qxqtgwk9j-MbAPdEGBmEHq6r8VU | Additional information | false |
    Then I check that all page urls works properly

    # And they are spiderable

  @watch
  Scenario: Check that all secondary pages work well when logged
    Given I have an account and I logged in
    And a list of page urls and contents
      | status                 | Status                  | false |
      | fires                  | Fires                   | true  |
      | zones                  | Monitored               | true  |
      | verify-email/something | Verify                  | true  |
      | fire/inexistent        | This page doesn't exist | false |
      | fire/Fe26.2**1a0361ed0384f741403682e26b4bbc3850bee24e775da13c9782b22365ea895f*r_3gmVad5vzkeyqPpo6UcA*1s5fFz3iDGKTYP2RCvXMshof00QCHf4ErDl9K2dxoX0u-J-t6scyOWG8pGp3ehg_FfEtyR_kYcEKU3rE0jaSlZbD09TIvhiIJeS3C6Uc8YD-rit0XBrgsVKfYSxKzTRoOYiYFJ8JYd298hMtfiASePjS05Z58hhicyCcJYYRlarqDScG3LiVY3lL5y2nfcdIMNuSjCiKOJWuMkxwd9nR1UHMudLl0hEoy56mPdnHpDYtP9IYUlIOk1LlWBxcmHKifbXeqHu94p8j13Kk20dh2R49Hw3KsSoE9UbWmGQA9wAZXT82301i3rGF5GPAKjlTlRYcWisQurnPwHSVmx3DhUdiYwKGxt4KeaM5QVI4BE9octvE41OOprB_-Il105diQEh2Y9vdvX51ZVWIRfCboICPM6rJb0Oin7U7F1iM-oD_5s3DGnelfM5LGBcKwiB5paMo5M5vdBMaO-zR216cW9yGVXw9IZqHx8xDQWnoHAZjt8NLHeiGF2QOmIGtEUH7qnwhGpkcvszajmAZzR8saZgoH1qfBfvpVA41YfV14gU**4d030f05e23ad75409cebc609107467fc60be5077d52cf041087cd024fc4dc45*GY97aGFc1MyAsoO3Qxqtgwk9j-MbAPdEGBmEHq6r8VU | Additional information | false |
    Then I check that all page urls works properly

  @watch
  Scenario: Check that other non visible pages work well
    Given I logout if logged
    And a list of non visible pages ids and contents
      | error                            | Upppps      | false |
      # FIXME: find a way to monitor json pages
      # | api/v1/status/last-fire-detected | updateAt    |
      # | api/v1/status/last-fire-check    | description |
      # | api/v1/status/active-fires-count | total       |
    Then I check that all non visible pages works properly
